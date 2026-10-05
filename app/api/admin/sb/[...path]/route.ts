import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { SUPABASE_URL, serviceKey } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// Admin-only pass-through to the Supabase REST API. The admin page talks to
// the database through here, so the secret key stays on the server and only a
// logged-in admin can change data.

const FORWARD = ["content-type", "prefer", "range", "range-unit", "accept", "accept-profile", "content-profile", "x-client-info"];
const RETURN = ["content-type", "content-range", "preference-applied"];

async function handle(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "Admin login required", code: "401" }, { status: 401 });
  }
  const path = (params.path ?? []).join("/");
  if (!path.startsWith("rest/v1/")) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }
  const key = serviceKey() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const headers: Record<string, string> = { apikey: key, Authorization: `Bearer ${key}` };
  for (const h of FORWARD) {
    const v = req.headers.get(h);
    if (v) headers[h] = v;
  }
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const upstream = await fetch(`${SUPABASE_URL}/${path}${req.nextUrl.search}`, {
    method: req.method,
    headers,
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  });
  const out = new Headers({ "Cache-Control": "no-store" });
  for (const h of RETURN) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }
  const noBody = req.method === "HEAD" || upstream.status === 204 || upstream.status === 304;
  return new NextResponse(noBody ? null : await upstream.arrayBuffer(), { status: upstream.status, headers: out });
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE, handle as HEAD };
