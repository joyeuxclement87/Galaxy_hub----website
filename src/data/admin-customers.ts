import "server-only";
import { createClient } from "@/lib/supabase-server";

/* ─── Customers, derived from existing records (orders, trade-ins,
   contact messages, product enquiries). No customer table is created. ──── */

export interface CustomerRecord {
  key: string;
  name: string;
  phone: string | null;
  email: string | null;
  orders: number;
  totalSpent: number;
  tradeIns: number;
  messages: number;
  lastActivity: string;
}

export interface CustomerDetail {
  orders: {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
  }[];
  tradeIns: {
    id: string;
    trade_in_id: string;
    wanted_product_name: string;
    status: string;
    created_at: string;
  }[];
  messages: {
    id: string;
    type: "contact" | "enquiry";
    subject: string | null;
    status: string;
    created_at: string;
  }[];
}

export interface CustomerWithDetail extends CustomerRecord {
  detail: CustomerDetail;
}

export async function getCustomers(): Promise<CustomerRecord[]> {
  const supabase = createClient();

  const [ordersRes, tradeInsRes, contactsRes, enquiriesRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, customer_name, phone, email, total_amount, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("trade_ins")
      .select("id, trade_in_id, customer_name, phone, email, wanted_product_name, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("contact_messages")
      .select("id, name, phone, email, subject, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("product_enquiries")
      .select("id, name, phone, email, product_name, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const map = new Map<string, CustomerRecord>();

  const keyFor = (name: string, phone: string | null) =>
    (phone ?? name).toLowerCase().trim().replace(/\s+/g, "");

  const ensure = (name: string, phone: string | null, email: string | null): CustomerRecord => {
    const key = keyFor(name, phone);
    let rec = map.get(key);
    if (!rec) {
      rec = {
        key,
        name,
        phone,
        email,
        orders: 0,
        totalSpent: 0,
        tradeIns: 0,
        messages: 0,
        lastActivity: "",
      };
      map.set(key, rec);
    }
    if (!rec.email && email) rec.email = email;
    if (!rec.phone && phone) rec.phone = phone;
    if (!rec.name || rec.name.length > name.length) rec.name = name;
    return rec;
  };

  (ordersRes.data ?? []).forEach((o) => {
    const rec = ensure(o.customer_name, o.phone, o.email);
    rec.orders += 1;
    if (o.status !== "cancelled") rec.totalSpent += Number(o.total_amount ?? 0);
    if (!rec.lastActivity || o.created_at > rec.lastActivity) rec.lastActivity = o.created_at;
  });

  (tradeInsRes.data ?? []).forEach((t) => {
    const rec = ensure(t.customer_name, t.phone, t.email);
    rec.tradeIns += 1;
    if (!rec.lastActivity || t.created_at > rec.lastActivity) rec.lastActivity = t.created_at;
  });

  (contactsRes.data ?? []).forEach((c) => {
    const rec = ensure(c.name, c.phone, c.email);
    rec.messages += 1;
    if (!rec.lastActivity || c.created_at > rec.lastActivity) rec.lastActivity = c.created_at;
  });

  (enquiriesRes.data ?? []).forEach((e) => {
    const rec = ensure(e.name, e.phone, e.email);
    rec.messages += 1;
    if (!rec.lastActivity || e.created_at > rec.lastActivity) rec.lastActivity = e.created_at;
  });

  return [...map.values()].sort((a, b) => (b.lastActivity || "").localeCompare(a.lastActivity || ""));
}

export async function getCustomersWithDetail(): Promise<CustomerWithDetail[]> {
  const supabase = createClient();

  const [ordersRes, tradeInsRes, contactsRes, enquiriesRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, customer_name, phone, email, total_amount, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("trade_ins")
      .select("id, trade_in_id, customer_name, phone, email, wanted_product_name, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("contact_messages")
      .select("id, name, phone, email, subject, message, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("product_enquiries")
      .select("id, name, phone, email, product_name, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const map = new Map<string, CustomerWithDetail>();
  const keyFor = (name: string, phone: string | null) =>
    (phone ?? name).toLowerCase().trim().replace(/\s+/g, "");

  const ensure = (name: string, phone: string | null, email: string | null): CustomerWithDetail => {
    const key = keyFor(name, phone);
    let rec = map.get(key);
    if (!rec) {
      rec = {
        key,
        name,
        phone,
        email,
        orders: 0,
        totalSpent: 0,
        tradeIns: 0,
        messages: 0,
        lastActivity: "",
        detail: { orders: [], tradeIns: [], messages: [] },
      };
      map.set(key, rec);
    }
    if (!rec.email && email) rec.email = email;
    if (!rec.phone && phone) rec.phone = phone;
    return rec;
  };

  (ordersRes.data ?? []).forEach((o) => {
    const rec = ensure(o.customer_name, o.phone, o.email);
    rec.orders += 1;
    if (o.status !== "cancelled") rec.totalSpent += Number(o.total_amount ?? 0);
    if (!rec.lastActivity || o.created_at > rec.lastActivity) rec.lastActivity = o.created_at;
    rec.detail.orders.push({
      id: o.id,
      order_number: o.order_number,
      status: o.status,
      total_amount: Number(o.total_amount ?? 0),
      created_at: o.created_at,
    });
  });

  (tradeInsRes.data ?? []).forEach((t) => {
    const rec = ensure(t.customer_name, t.phone, t.email);
    rec.tradeIns += 1;
    if (!rec.lastActivity || t.created_at > rec.lastActivity) rec.lastActivity = t.created_at;
    rec.detail.tradeIns.push({
      id: t.id,
      trade_in_id: t.trade_in_id,
      wanted_product_name: t.wanted_product_name,
      status: t.status,
      created_at: t.created_at,
    });
  });

  const pushMessage = (rec: CustomerWithDetail, m: CustomerDetail["messages"][0]) => {
    rec.messages += 1;
    if (!rec.lastActivity || m.created_at > rec.lastActivity) rec.lastActivity = m.created_at;
    rec.detail.messages.push(m);
  };

  (contactsRes.data ?? []).forEach((c) => {
    pushMessage(ensure(c.name, c.phone, c.email), {
      id: c.id,
      type: "contact",
      subject: c.subject ?? c.message ?? null,
      status: c.status,
      created_at: c.created_at,
    });
  });

  (enquiriesRes.data ?? []).forEach((e) => {
    pushMessage(ensure(e.name, e.phone, e.email), {
      id: e.id,
      type: "enquiry",
      subject: e.product_name,
      status: e.status,
      created_at: e.created_at,
    });
  });

  return [...map.values()]
    .sort((a, b) => (b.lastActivity || "").localeCompare(a.lastActivity || ""))
    .sort((a, b) => b.orders - a.orders);
}