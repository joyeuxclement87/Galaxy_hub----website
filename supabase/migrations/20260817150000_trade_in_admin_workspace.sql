-- ============================================================
-- TRADE-IN ADMIN WORKSPACE
-- Extends the trade_ins record with valuation, offer and
-- Telegram delivery state, plus related tables for staff
-- inspection, internal notes, activity history and valuation
-- history. Customer-submitted values are NEVER overwritten by
-- staff: inspections live in their own table.
--
-- Security: all new tables enable RLS with NO public policies.
-- They are only reachable through the service-role client used
-- by server actions behind the admin auth layout. The anon role
-- keeps its insert-only policy on trade_ins.
-- ============================================================

-- ─── trade_ins additions ────────────────────────────────────────────────────

alter table public.trade_ins add column if not exists valuation_notes text;
alter table public.trade_ins add column if not exists valued_by text;
alter table public.trade_ins add column if not exists valued_at timestamptz;

alter table public.trade_ins add column if not exists offer_status text
  check (offer_status is null or offer_status in ('ready', 'sent', 'accepted', 'rejected'));
alter table public.trade_ins add column if not exists offer_sent_at timestamptz;
alter table public.trade_ins add column if not exists offer_accepted_at timestamptz;
alter table public.trade_ins add column if not exists offer_rejected_at timestamptz;

alter table public.trade_ins add column if not exists linked_order_id uuid
  references public.orders(id) on delete set null;

alter table public.trade_ins add column if not exists telegram_sent_at timestamptz;
alter table public.trade_ins add column if not exists telegram_error text;

alter table public.trade_ins add column if not exists completed_at timestamptz;

create index if not exists trade_ins_linked_order_idx
on public.trade_ins(linked_order_id);

-- ─── STAFF INSPECTION (separate from customer-reported data) ────────────────

create table public.trade_in_inspections (
  id uuid primary key default gen_random_uuid(),
  trade_in_id uuid not null unique references public.trade_ins(id) on delete cascade,
  inspected_condition text
    check (inspected_condition is null or inspected_condition in ('like_new', 'good', 'fair', 'damaged')),
  battery_health text,
  screen_condition text
    check (screen_condition is null or screen_condition in ('perfect', 'minor_scratches', 'visible_scratches', 'cracked')),
  body_condition text
    check (body_condition is null or body_condition in ('like_new', 'good', 'fair', 'damaged')),
  functional_status text
    check (functional_status is null or functional_status in ('fully_working', 'minor_issues', 'major_issues', 'not_working')),
  imei_verified boolean not null default false,
  additional_faults text,
  inspection_notes text,
  inspected_by text,
  inspected_at timestamptz not null default now()
);

-- ─── INTERNAL NOTES (never sent to customers) ───────────────────────────────

create table public.trade_in_notes (
  id uuid primary key default gen_random_uuid(),
  trade_in_id uuid not null references public.trade_ins(id) on delete cascade,
  note text not null,
  created_by text,
  created_at timestamptz not null default now()
);

-- ─── ACTIVITY HISTORY ───────────────────────────────────────────────────────

create table public.trade_in_activity (
  id uuid primary key default gen_random_uuid(),
  trade_in_id uuid not null references public.trade_ins(id) on delete cascade,
  event_type text not null,
  description text not null,
  created_by text,
  created_at timestamptz not null default now()
);

-- ─── VALUATION HISTORY ──────────────────────────────────────────────────────

create table public.trade_in_valuations (
  id uuid primary key default gen_random_uuid(),
  trade_in_id uuid not null references public.trade_ins(id) on delete cascade,
  estimated_value numeric(14, 2),
  final_value numeric(14, 2),
  notes text,
  created_by text,
  created_at timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────

create index trade_in_notes_trade_in_id_idx
on public.trade_in_notes(trade_in_id);

create index trade_in_activity_trade_in_id_idx
on public.trade_in_activity(trade_in_id, created_at);

create index trade_in_valuations_trade_in_id_idx
on public.trade_in_valuations(trade_in_id, created_at);

-- ─── RLS: admin-only (no public policies) ───────────────────────────────────

alter table public.trade_in_inspections enable row level security;
alter table public.trade_in_notes enable row level security;
alter table public.trade_in_activity enable row level security;
alter table public.trade_in_valuations enable row level security;