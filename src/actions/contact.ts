"use server";

import { createClient } from "@/lib/supabase-server";
import { sendNotification } from "@/lib/notifications";

const RATE_LIMIT_WINDOW_MS = 60_000;

function cleanInput(value: string | undefined, maxLength: number): string {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const name = cleanInput(formData.name, 120);
  const email = cleanInput(formData.email, 160).toLowerCase();
  const phone = cleanInput(formData.phone, 30);
  const subject = cleanInput(formData.subject, 200);
  const message = cleanInput(formData.message, 5000);

  if (!name || !email || !phone || !subject || !message) {
    return { error: "All fields are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createClient();

  // Rate limit: block repeated submissions from the same contact within the window.
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { data: recent } = await supabase
    .from("contact_messages")
    .select("id")
    .or(`email.eq.${email},phone.eq.${phone}`)
    .gte("created_at", since)
    .limit(1);

  if (recent && recent.length > 0) {
    return { error: "Your message was just received. Please wait a moment before sending another." };
  }

  const { data: saved, error } = await supabase
    .from("contact_messages")
    .insert({ name, email, phone, subject, message })
    .select("id")
    .single();

  if (error || !saved) {
    console.error("[contact] Failed to save message:", error);
    return { error: "Something went wrong. Please try again." };
  }

  // Best-effort staff notification — never blocks the success response.
  await sendNotification({
    topic: "contact",
    data: {
      contact: { name, email, phone, subject, message },
    },
  });

  return { success: true };
}
