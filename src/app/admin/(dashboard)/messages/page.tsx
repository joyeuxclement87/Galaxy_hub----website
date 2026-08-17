import { Suspense } from "react";
import { getContactMessages, getProductEnquiries } from "@/actions/messages";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

async function MessagesContent() {
  const [contactMessages, productEnquiries] = await Promise.all([
    getContactMessages(),
    getProductEnquiries(),
  ]);

  return (
    <MessagesClient
      initialContactMessages={contactMessages}
      initialProductEnquiries={productEnquiries}
    />
  );
}

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-clash text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          View and manage contact form submissions and product enquiries sent from the website.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-50 dark:bg-[#0f2438]" />}>
        <MessagesContent />
      </Suspense>
    </div>
  );
}
