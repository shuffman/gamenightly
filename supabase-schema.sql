-- GameNightly Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Calendars table
create table calendars (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Invitees table
create table invitees (
  id uuid default uuid_generate_v4() primary key,
  calendar_id uuid references calendars(id) on delete cascade not null,
  name text not null,
  token text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Availability table
create table availability (
  id uuid default uuid_generate_v4() primary key,
  invitee_id uuid references invitees(id) on delete cascade not null,
  date date not null,
  available boolean default true not null,
  unique(invitee_id, date)
);

-- Create indexes for better query performance
create index idx_invitees_calendar_id on invitees(calendar_id);
create index idx_invitees_token on invitees(token);
create index idx_availability_invitee_id on availability(invitee_id);

-- Enable Row Level Security (RLS)
alter table calendars enable row level security;
alter table invitees enable row level security;
alter table availability enable row level security;

-- Create policies for public access (for simplicity)
-- In production, you'd want more restrictive policies

create policy "Allow public read access to calendars"
  on calendars for select
  to anon
  using (true);

create policy "Allow public insert to calendars"
  on calendars for insert
  to anon
  with check (true);

create policy "Allow public read access to invitees"
  on invitees for select
  to anon
  using (true);

create policy "Allow public insert to invitees"
  on invitees for insert
  to anon
  with check (true);

create policy "Allow public read access to availability"
  on availability for select
  to anon
  using (true);

create policy "Allow public insert to availability"
  on availability for insert
  to anon
  with check (true);

create policy "Allow public update to availability"
  on availability for update
  to anon
  using (true);

create policy "Allow public delete to availability"
  on availability for delete
  to anon
  using (true);
