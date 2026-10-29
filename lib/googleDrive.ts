import crypto from "crypto";

// Read-only access to the Google Drive folders shared with the website's
// service account (GOOGLE_SERVICE_ACCOUNT_JSON in Vercel). Used by the admin
// "Import from Google Drive" button.

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

export type DriveItem = { id: string; name: string; mimeType: string; isFolder: boolean; size: number };

const SCOPE = "https://www.googleapis.com/auth/drive.readonly";
const API = "https://www.googleapis.com/drive/v3";

function account(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const a = JSON.parse(raw) as ServiceAccount;
    if (!a.client_email || !a.private_key) return null;
    // Some dashboards turn the \n inside the key into a literal "\n".
    return { ...a, private_key: a.private_key.replace(/\\n/g, "\n") };
  } catch {
    return null;
  }
}

export function driveConfigured(): boolean {
  return account() !== null;
}

export function driveRobotEmail(): string {
  return account()?.client_email ?? "";
}

const b64url = (v: string | Buffer) => Buffer.from(v).toString("base64url");

let cached: { token: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const a = account();
  if (!a) throw new Error("Google Drive is not set up yet (GOOGLE_SERVICE_ACCOUNT_JSON is missing).");
  const tokenUri = a.token_uri || "https://oauth2.googleapis.com/token";
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(JSON.stringify({
    iss: a.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600,
  }))}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(a.private_key);
  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${b64url(signature)}`,
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(`Google login failed: ${data.error_description || data.error || res.status}`);
  cached = { token: data.access_token, exp: Date.now() + (Number(data.expires_in) || 3600) * 1000 };
  return cached.token;
}

async function driveFetch(path: string): Promise<Response> {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${await accessToken()}` }, cache: "no-store" });
  if (res.status === 404) throw new Error("Folder or file not found. Check the link, and that it is shared with the website's robot email.");
  if (!res.ok) throw new Error(`Google Drive error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

/** Accepts a folder link, a file link or a bare ID. */
export function parseDriveId(input: string): string {
  const s = input.trim();
  const m = s.match(/\/folders\/([\w-]{10,})/) || s.match(/\/d\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/);
  if (m) return m[1];
  return /^[\w-]{10,}$/.test(s) ? s : "";
}

export async function folderInfo(id: string): Promise<{ id: string; name: string; parentId: string }> {
  const res = await driveFetch(`/files/${encodeURIComponent(id)}?fields=id,name,parents,mimeType&supportsAllDrives=true`);
  const f = await res.json();
  return { id: f.id, name: f.name, parentId: Array.isArray(f.parents) ? f.parents[0] ?? "" : "" };
}

/** Top-level folders shared with the website's robot email. */
export async function listShared(): Promise<DriveItem[]> {
  const q = encodeURIComponent("sharedWithMe = true and trashed = false and mimeType = 'application/vnd.google-apps.folder'");
  const res = await driveFetch(`/files?q=${q}&fields=files(id,name,mimeType)&orderBy=name&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true`);
  const data = await res.json();
  return (data.files ?? []).map((f: { id: string; name: string; mimeType: string }) => ({ id: f.id, name: f.name, mimeType: f.mimeType, isFolder: true, size: 0 }));
}

/** True when the robot can open this folder (used to hide "Up" above shared folders). */
export async function canOpen(id: string): Promise<boolean> {
  if (!id) return false;
  try { await driveFetch(`/files/${encodeURIComponent(id)}?fields=id&supportsAllDrives=true`); return true; } catch { return false; }
}

/** Photos and subfolders directly inside a folder. */
export async function listFolder(id: string): Promise<DriveItem[]> {
  const out: DriveItem[] = [];
  let pageToken = "";
  do {
    const q = encodeURIComponent(`'${id}' in parents and trashed = false and (mimeType = 'application/vnd.google-apps.folder' or mimeType contains 'image/')`);
    const res = await driveFetch(`/files?q=${q}&fields=nextPageToken,files(id,name,mimeType,size)&orderBy=folder,name&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ""}`);
    const data = await res.json();
    for (const f of data.files ?? []) {
      out.push({ id: f.id, name: f.name, mimeType: f.mimeType, isFolder: f.mimeType === "application/vnd.google-apps.folder", size: Number(f.size) || 0 });
    }
    pageToken = data.nextPageToken ?? "";
  } while (pageToken && out.length < 1000);
  return out;
}

/** Small preview image for the admin picker. */
export async function thumbnail(id: string): Promise<{ body: ArrayBuffer; type: string } | null> {
  const meta = await (await driveFetch(`/files/${encodeURIComponent(id)}?fields=thumbnailLink&supportsAllDrives=true`)).json();
  if (!meta.thumbnailLink) return null;
  const link = String(meta.thumbnailLink).replace(/=s\d+$/, "=s400");
  const res = await fetch(link, { headers: { Authorization: `Bearer ${await accessToken()}` }, cache: "no-store" });
  if (!res.ok) return null;
  return { body: await res.arrayBuffer(), type: res.headers.get("content-type") || "image/jpeg" };
}

export async function downloadFile(id: string): Promise<{ name: string; mimeType: string; data: ArrayBuffer }> {
  const meta = await (await driveFetch(`/files/${encodeURIComponent(id)}?fields=name,mimeType,size&supportsAllDrives=true`)).json();
  if (!String(meta.mimeType).startsWith("image/")) throw new Error(`"${meta.name}" is not a photo.`);
  if (Number(meta.size) > 40 * 1024 * 1024) throw new Error(`"${meta.name}" is larger than 40 MB.`);
  const res = await driveFetch(`/files/${encodeURIComponent(id)}?alt=media&supportsAllDrives=true`);
  return { name: meta.name, mimeType: meta.mimeType, data: await res.arrayBuffer() };
}
