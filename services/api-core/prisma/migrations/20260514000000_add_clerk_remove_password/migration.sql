-- Migration: add_clerk_remove_password
-- Replaces password-based auth with Clerk identity provider

-- Add clerkId column (nullable first to allow backfill)
ALTER TABLE "users" ADD COLUMN "clerk_id" TEXT;

-- Set a default role for existing users (safety)
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'patient';

-- Make clerkId unique and not null after backfill
-- NOTE: In production, backfill clerk_id before running the next statement
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_key" UNIQUE ("clerk_id");

-- Remove password_hash column
ALTER TABLE "users" DROP COLUMN IF EXISTS "password_hash";
