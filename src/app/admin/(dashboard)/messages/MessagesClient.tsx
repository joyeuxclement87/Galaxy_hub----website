"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  User,
  Clock,
  Trash2,
  CheckCircle,
  Archive,
  MessageSquare,
  Inbox,
} from "lucide-react";
import {
  updateContactMessageStatus,
  updateProductEnquiryStatus,
  deleteContactMessage,
  deleteProductEnquiry,
} from "@/actions/messages";
import { cn } from "@/lib/utils";

interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface ProductEnquiry {
  id: string;
  product_id: string | null;
  product_slug: string | null;
  product_name: string;
  variant: string | null;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface MessagesClientProps {
  initialContactMessages: ContactMessage[];
  initialProductEnquiries: ProductEnquiry[];
}

export function MessagesClient({
  initialContactMessages,
  initialProductEnquiries,
}: MessagesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"contact" | "enquiry">("contact");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    initialContactMessages[0]?.id || null
  );
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(
    initialProductEnquiries[0]?.id || null
  );

  // Filters
  const [contactFilter, setContactFilter] = useState<string>("all");
  const [enquiryFilter, setEnquiryFilter] = useState<string>("all");

  const handleUpdateContactStatus = (id: string, status: any) => {
    startTransition(async () => {
      const res = await updateContactMessageStatus(id, status);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleUpdateEnquiryStatus = (id: string, status: any) => {
    startTransition(async () => {
      const res = await updateProductEnquiryStatus(id, status);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleDeleteContact = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message permanently?")) return;
    startTransition(async () => {
      const res = await deleteContactMessage(id);
      if (res?.error) {
        alert(res.error);
      } else {
        setSelectedContactId(null);
        router.refresh();
      }
    });
  };

  const handleDeleteEnquiry = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry permanently?")) return;
    startTransition(async () => {
      const res = await deleteProductEnquiry(id);
      if (res?.error) {
        alert(res.error);
      } else {
        setSelectedEnquiryId(null);
        router.refresh();
      }
    });
  };

  // Filtered lists
  const filteredContacts = initialContactMessages.filter((m) => {
    if (contactFilter === "all") return true;
    return m.status === contactFilter;
  });

  const filteredEnquiries = initialProductEnquiries.filter((e) => {
    if (enquiryFilter === "all") return true;
    return e.status === enquiryFilter;
  });

  const activeContact = filteredContacts.find((c) => c.id === selectedContactId) || filteredContacts[0];
  const activeEnquiry = filteredEnquiries.find((e) => e.id === selectedEnquiryId) || filteredEnquiries[0];

  const statusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return { bg: "bg-blue-50 dark:bg-blue-500/15", text: "text-blue-600 dark:text-blue-300", ring: "ring-blue-100 dark:ring-blue-500/25" };
      case "read":
      case "contacted":
        return { bg: "bg-amber-50 dark:bg-amber-500/15", text: "text-amber-600 dark:text-amber-300", ring: "ring-amber-100 dark:ring-amber-500/25" };
      case "responded":
      case "closed":
        return { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300", ring: "ring-emerald-100 dark:ring-emerald-500/25" };
      case "archived":
        return { bg: "bg-slate-50 dark:bg-[#0f2438]", text: "text-slate-400 dark:text-slate-500", ring: "ring-slate-200" };
      default:
        return { bg: "bg-slate-50 dark:bg-[#0f2438]", text: "text-slate-500 dark:text-slate-400", ring: "ring-slate-200" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-[#1a3352]">
        <button
          onClick={() => setActiveTab("contact")}
          className={cn(
            "px-5 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2",
            activeTab === "contact"
              ? "border-[#0f70c9] text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0f2438]"
              : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600"
          )}
        >
          <Mail className="h-4 w-4" />
          Contact Forms ({initialContactMessages.length})
        </button>
        <button
          onClick={() => setActiveTab("enquiry")}
          className={cn(
            "px-5 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2",
            activeTab === "enquiry"
              ? "border-[#0f70c9] text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0f2438]"
              : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Product Enquiries ({initialProductEnquiries.length})
        </button>
      </div>

      {activeTab === "contact" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          {/* Master List Column */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-caption font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Filter Status
              </span>
              <select
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
              >
                <option value="all">All Messages</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] py-20 text-center flex-1">
                <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No messages match filter</p>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1 no-scrollbar">
                {filteredContacts.map((msg) => {
                  const active = activeContact?.id === msg.id;
                  const cfg = statusConfig(msg.status);
                  return (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedContactId(msg.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden group cursor-pointer",
                        active
                          ? "border-[#0f70c9] bg-ocean-light dark:bg-ocean/15 shadow-lg"
                          : "border-slate-100 dark:border-[#1a3352] bg-slate-50 dark:bg-[#0f2438] hover:border-slate-200 dark:border-[#1e3a5f] dark:hover:border-slate-600 hover:bg-white dark:hover:bg-[#132c46]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0f70c9] transition-colors truncate">
                          {msg.name}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring} shrink-0`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">
                        {msg.subject || "No Subject"}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(msg.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Column */}
          <div className="lg:col-span-7">
            {activeContact ? (
              <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-6 space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1a3352] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Message Actions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeContact.status === "new" && (
                      <button
                        onClick={() => handleUpdateContactStatus(activeContact.id, "read")}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 dark:bg-[#0f2438] border border-slate-200 dark:border-[#1e3a5f] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-all cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark Read
                      </button>
                    )}
                    {activeContact.status !== "responded" && (
                      <button
                        onClick={() => handleUpdateContactStatus(activeContact.id, "responded")}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Responded
                      </button>
                    )}
                    {activeContact.status !== "archived" && (
                      <button
                        onClick={() => handleUpdateContactStatus(activeContact.id, "archived")}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 dark:bg-[#0f2438] border border-slate-200 dark:border-[#1e3a5f] px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-all cursor-pointer"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteContact(activeContact.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 dark:bg-red-500/15 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer ml-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Details Body */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Subject
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-clash">
                      {activeContact.subject || "No Subject"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-[#0f2438] rounded-2xl p-4 border border-slate-100 dark:border-[#1a3352]">
                    <div className="flex items-center gap-2.5 text-sm">
                      <User className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Sender</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{activeContact.name}</p>
                      </div>
                    </div>
                    {activeContact.email && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Email Address</p>
                          <a href={`mailto:${activeContact.email}`} className="text-[#0f70c9] hover:underline font-medium mt-0.5 block">{activeContact.email}</a>
                        </div>
                      </div>
                    )}
                    {activeContact.phone && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Phone Number</p>
                          <a href={`tel:${activeContact.phone}`} className="text-slate-700 dark:text-slate-300 hover:underline font-medium mt-0.5 block">{activeContact.phone}</a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Received Date</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                          {new Date(activeContact.created_at).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                      Message Content
                    </span>
                    <div className="bg-slate-50 dark:bg-[#0f2438] border border-slate-100 dark:border-[#1a3352] rounded-2xl p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {activeContact.message}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] h-full py-32 text-center">
                <Inbox className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-clash text-lg font-bold text-slate-600 dark:text-slate-400">No message selected</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Select a message from the list to view its full details.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          {/* Master List Column */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-caption font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Filter Status
              </span>
              <select
                value={enquiryFilter}
                onChange={(e) => setEnquiryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
              >
                <option value="all">All Enquiries</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] py-20 text-center flex-1">
                <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No enquiries match filter</p>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1 no-scrollbar">
                {filteredEnquiries.map((enq) => {
                  const active = activeEnquiry?.id === enq.id;
                  const cfg = statusConfig(enq.status);
                  return (
                    <button
                      key={enq.id}
                      onClick={() => setSelectedEnquiryId(enq.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden group cursor-pointer",
                        active
                          ? "border-[#0f70c9] bg-ocean-light dark:bg-ocean/15 shadow-lg"
                          : "border-slate-100 dark:border-[#1a3352] bg-slate-50 dark:bg-[#0f2438] hover:border-slate-200 dark:border-[#1e3a5f] dark:hover:border-slate-600 hover:bg-white dark:hover:bg-[#132c46]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0f70c9] transition-colors truncate">
                          {enq.name}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring} shrink-0`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">
                        Quote: {enq.product_name}
                      </p>
                      {enq.notes && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                          {enq.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(enq.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Column */}
          <div className="lg:col-span-7">
            {activeEnquiry ? (
              <div className="rounded-2xl border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] p-6 space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1a3352] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Enquiry Actions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeEnquiry.status === "new" && (
                      <button
                        onClick={() => handleUpdateEnquiryStatus(activeEnquiry.id, "contacted")}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 dark:bg-[#0f2438] border border-slate-200 dark:border-[#1e3a5f] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c3a5c] transition-all cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark Contacted
                      </button>
                    )}
                    {activeEnquiry.status !== "closed" && (
                      <button
                        onClick={() => handleUpdateEnquiryStatus(activeEnquiry.id, "closed")}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Close Enquiry
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteEnquiry(activeEnquiry.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 dark:bg-red-500/15 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer ml-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Details Body */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Product Enquired
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-clash">
                      {activeEnquiry.product_name}
                      {activeEnquiry.variant && (
                        <span className="text-sm font-semibold text-[#0f70c9] ml-2">
                          ({activeEnquiry.variant})
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-[#0f2438] rounded-2xl p-4 border border-slate-100 dark:border-[#1a3352]">
                    <div className="flex items-center gap-2.5 text-sm">
                      <User className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Customer Name</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{activeEnquiry.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Phone Number</p>
                        <a href={`tel:${activeEnquiry.phone}`} className="text-slate-700 dark:text-slate-300 hover:underline font-medium mt-0.5 block">{activeEnquiry.phone}</a>
                      </div>
                    </div>
                    {activeEnquiry.email && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Email Address</p>
                          <a href={`mailto:${activeEnquiry.email}`} className="text-[#0f70c9] hover:underline font-medium mt-0.5 block">{activeEnquiry.email}</a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">Requested On</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                          {new Date(activeEnquiry.created_at).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {activeEnquiry.notes && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                        Notes / Requirements
                      </span>
                      <div className="bg-slate-50 dark:bg-[#0f2438] border border-slate-100 dark:border-[#1a3352] rounded-2xl p-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {activeEnquiry.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] h-full py-32 text-center">
                <Inbox className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4 animate-pulse" />
                <h3 className="font-clash text-lg font-bold text-slate-600 dark:text-slate-400">No enquiry selected</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Select an enquiry from the list to view customer requirements.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
