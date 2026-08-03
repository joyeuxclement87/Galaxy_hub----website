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
        <h1 className="font-clash text-2xl font-bold text-white tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-white/40">
          View and manage contact form submissions and product enquiries sent from the website.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white/5" />}>
        <MessagesContent />
      </Suspense>
    </div>
  );
}
