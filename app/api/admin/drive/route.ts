import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { driveConfigured, driveRobotEmail, folderInfo, listFolder, parseDriveId, thumbnail, downloadFile } from "@/lib/googleDrive";
import { cloudinaryConfigured, uploadImage } from "@/lib/cloudinaryServer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Admin-only: browse Drive folders shared with the website and copy chosen
// photos to Cloudinary.
//   GET  ?status=1          → which keys are set up
//   GET  ?folder=<link|id>  → folder name, parent, subfolders and photos
//   GET  ?thumb=<fileId>    → small preview image
//   POST { fileId }         → uploads that photo to Cloudinary, returns { url }

const deny = () => NextResponse.json({ error: "Admin login required" }, { status: 401 });
const fail = (e: unknown, status = 400) => NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status });

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return deny();
  const sp = req.nextUrl.searchParams;
  if (sp.get("status")) {
    return NextResponse.json({ drive: driveConfigured(), cloudinary: cloudinaryConfigured(), robotEmail: driveRobotEmail() });
  }
  try {
    const thumb = sp.get("thumb");
    if (thumb) {
      const t = await thumbnail(parseDriveId(thumb));
      if (!t) return new NextResponse(null, { status: 404 });
      return new NextResponse(t.body, { headers: { "Content-Type": t.type, "Cache-Control": "private, max-age=3600" } });
    }
    const id = parseDriveId(sp.get("folder") ?? "");
    if (!id) return fail(new Error("Paste a Google Drive folder link."));
    const [info, items] = await Promise.all([folderInfo(id), listFolder(id)]);
    return NextResponse.json({
      folder: info,
      folders: items.filter((i) => i.isFolder).map(({ id, name }) => ({ id, name })),
      photos: items.filter((i) => !i.isFolder).map(({ id, name, mimeType, size }) => ({ id, name, mimeType, size })),
    });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return deny();
  try {
    const { fileId, folder } = await req.json();
    const id = parseDriveId(String(fileId ?? ""));
    if (!id) return fail(new Error("Missing photo."));
    const target = typeof folder === "string" && /^[\w/-]{1,60}$/.test(folder) ? folder : "classie-products";
    const url = await uploadImage(await downloadFile(id), target);
    return NextResponse.json({ url });
  } catch (e) {
    return fail(e);
  }
}
