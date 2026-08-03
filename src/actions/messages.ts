"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function getContactMessages() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
  return data || [];
}

export async function getProductEnquiries() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("product_enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching product enquiries:", error);
    return [];
  }
  return data || [];
}

export async function updateContactMessageStatus(id: string, status: "new" | "read" | "responded" | "archived") {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function updateProductEnquiryStatus(id: string, status: "new" | "contacted" | "closed") {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("product_enquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteContactMessage(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteProductEnquiry(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("product_enquiries")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/messages");
  return { success: true };
}
