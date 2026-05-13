-- Migration: 002_add_personal_attributes
-- Adds a personal attributes text field to profiles.
-- Used verbatim in cover letter generation (personal paragraph).

alter table profiles add column if not exists personal_attributes text default '';
