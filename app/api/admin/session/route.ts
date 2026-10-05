import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, usingLegacyPassword } from "@/lib/adminAuth";
import { hasServiceKey } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// Tells the admin page whether this browser is logged in, plus the security
// setup status shown at the top of the admin.
export async function GET(req: NextRequest) {
  const authed = isAdminRequest(req);
  return NextResponse.json(
    authed
      ? { authed, secretKey: hasServiceKey(), ownPassword: !usingLegacyPassword(), sessionSecret: !!process.env.ADMIN_SESSION_SECRET }
      : { authed },
    { headers: { "Cache-Control": "no-store" } },
  );
}
