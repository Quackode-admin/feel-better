-- Migration: add_nutritionist_invitation_flow
-- Agrega: tabla invitations, enums nuevos, campos faltantes en nutritionists, patients y profiles

-- ─── Nuevos Enums ─────────────────────────────────────────────────────────────

CREATE TYPE "NutritionistStatus" AS ENUM ('pending_invitation', 'active', 'disabled', 'deleted');
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE "PatientStatus" AS ENUM ('active', 'unassigned', 'in_treatment', 'inactive');

-- ─── Tabla invitations ────────────────────────────────────────────────────────

CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "clinic" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_by_id" TEXT,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invitations_token_hash_key" ON "invitations"("token_hash");
CREATE INDEX "invitations_email_idx" ON "invitations"("email");
CREATE INDEX "invitations_token_hash_idx" ON "invitations"("token_hash");
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- ─── Campos nuevos en nutritionists ──────────────────────────────────────────

ALTER TABLE "nutritionists"
    ADD COLUMN "status" "NutritionistStatus" NOT NULL DEFAULT 'active',
    ADD COLUMN "years_exp" INTEGER,
    ADD COLUMN "clinic" TEXT,
    ADD COLUMN "certifications" TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN "country" TEXT,
    ADD COLUMN "phone" TEXT;

CREATE INDEX "nutritionists_status_idx" ON "nutritionists"("status");

-- ─── Campos nuevos en patients ────────────────────────────────────────────────

ALTER TABLE "patients"
    ADD COLUMN "status" "PatientStatus" NOT NULL DEFAULT 'active';

CREATE INDEX "patients_status_idx" ON "patients"("status");

-- ─── Campos nuevos en profiles ───────────────────────────────────────────────

ALTER TABLE "profiles"
    ADD COLUMN "country" TEXT,
    ADD COLUMN "address" TEXT,
    ADD COLUMN "id_document" TEXT;
