import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { getAdminSummary } from "@/data/admin-summary";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getAdminSummary();
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: "Unable to load admin summary." },
      { status: 500 }
    );
  }
}