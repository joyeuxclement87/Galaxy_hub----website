import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { getSalesSeries } from "@/data/admin-dashboard";

export const dynamic = "force-dynamic";

const ALLOWED = [7, 30, 90, 365] as const;

export async function GET(request: NextRequest) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = request.nextUrl.searchParams.get("days");
  const days = (Number(raw) as (typeof ALLOWED)[number]);
  const safeDays = ALLOWED.includes(days) ? days : 30;

  try {
    const series = await getSalesSeries(safeDays);
    return NextResponse.json({ series });
  } catch {
    return NextResponse.json({ error: "Unable to load sales data." }, { status: 500 });
  }
}