import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const LIMIT = 5;

export async function GET(request: NextRequest) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], orders: [], tradeIns: [], messages: [] });
  }

  const db = createClient();
  const like = `%${q}%`;

  const [products, orders, tradeIns, contacts, enquiries] = await Promise.all([
    db.from("products").select("id, name, slug, price").ilike("name", like).limit(LIMIT),
    db
      .from("orders")
      .select("id, order_number, customer_name, status")
      .or(`order_number.ilike.${like},customer_name.ilike.${like},phone.ilike.${like}`)
      .limit(LIMIT),
    db
      .from("trade_ins")
      .select("id, trade_in_id, customer_name, wanted_product_name, status")
      .or(`trade_in_id.ilike.${like},customer_name.ilike.${like},phone.ilike.${like},wanted_product_name.ilike.${like}`)
      .limit(LIMIT),
    db
      .from("contact_messages")
      .select("id, name, subject, message, status")
      .or(`name.ilike.${like},subject.ilike.${like},message.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    db
      .from("product_enquiries")
      .select("id, name, product_name, notes, status")
      .or(`name.ilike.${like},product_name.ilike.${like},notes.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(LIMIT),
  ]);

  const messages = [
    ...(contacts.data ?? []).map((m) => ({ ...m, type: "contact" as const, subject: m.subject ?? m.message })),
    ...(enquiries.data ?? []).map((m) => ({ ...m, type: "enquiry" as const, subject: m.product_name ?? null })),
  ].slice(0, LIMIT);

  return NextResponse.json({
    products: products.data ?? [],
    orders: orders.data ?? [],
    tradeIns: tradeIns.data ?? [],
    messages,
  });
}