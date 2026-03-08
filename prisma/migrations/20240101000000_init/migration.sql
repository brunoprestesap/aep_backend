-- ============================================================
-- Migration: 20240101000000_init
-- AEP SaaS Platform – initial schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS

CREATE TYPE "user_role" AS ENUM ('admin', 'consultant', 'hr', 'manager', 'worker');
CREATE TYPE "assessment_status" AS ENUM ('draft', 'in_progress', 'completed', 'archived');
CREATE TYPE "hazard_category" AS ENUM ('ergonomic', 'psychosocial', 'physical', 'chemical', 'biological', 'mechanical');
CREATE TYPE "risk_severity" AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE "risk_probability" AS ENUM ('unlikely', 'possible', 'likely', 'almost_certain');
CREATE TYPE "risk_level" AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE "action_item_status" AS ENUM ('pending', 'in_progress', 'completed', 'overdue', 'cancelled');
CREATE TYPE "report_type" AS ENUM ('aep', 'risk_inventory', 'action_plan');
CREATE TYPE "report_format" AS ENUM ('pdf', 'docx', 'xlsx');
CREATE TYPE "report_status" AS ENUM ('queued', 'processing', 'completed', 'failed');
CREATE TYPE "file_context" AS ENUM ('evidence', 'report', 'action_item');

-- ============================================================
-- TENANTS
-- ============================================================

CREATE TABLE "tenants" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"       TEXT NOT NULL,
    "slug"       TEXT NOT NULL UNIQUE,
    "is_active"  BOOLEAN NOT NULL DEFAULT TRUE,
    "plan"       TEXT NOT NULL DEFAULT 'free',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE "users" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL REFERENCES "tenants"("id"),
    "name"          TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role"          "user_role" NOT NULL DEFAULT 'consultant',
    "is_active"     BOOLEAN NOT NULL DEFAULT TRUE,
    "last_login_at" TIMESTAMPTZ,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"    TIMESTAMPTZ,
    UNIQUE ("tenant_id", "email")
);

CREATE INDEX "users_tenant_id_idx" ON "users"("tenant_id");
CREATE INDEX "users_tenant_id_role_idx" ON "users"("tenant_id", "role");

-- ============================================================
-- ORGANIZATIONAL STRUCTURE
-- ============================================================

CREATE TABLE "organizations" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"      UUID NOT NULL REFERENCES "tenants"("id"),
    "name"           TEXT NOT NULL,
    "cnpj"           TEXT,
    "industry"       TEXT,
    "address"        TEXT,
    "employee_count" INT,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"     TIMESTAMPTZ
);

CREATE INDEX "organizations_tenant_id_idx" ON "organizations"("tenant_id");

CREATE TABLE "units" (
    "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"       UUID NOT NULL REFERENCES "tenants"("id"),
    "organization_id" UUID NOT NULL REFERENCES "organizations"("id"),
    "name"            TEXT NOT NULL,
    "address"         TEXT,
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"      TIMESTAMPTZ
);

CREATE INDEX "units_tenant_id_organization_id_idx" ON "units"("tenant_id", "organization_id");

CREATE TABLE "departments" (
    "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"   UUID NOT NULL REFERENCES "tenants"("id"),
    "unit_id"     UUID NOT NULL REFERENCES "units"("id"),
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"  TIMESTAMPTZ
);

CREATE INDEX "departments_tenant_id_unit_id_idx" ON "departments"("tenant_id", "unit_id");

CREATE TABLE "job_roles" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL REFERENCES "tenants"("id"),
    "department_id" UUID NOT NULL REFERENCES "departments"("id"),
    "name"          TEXT NOT NULL,
    "description"   TEXT,
    "worker_count"  INT NOT NULL DEFAULT 0,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"    TIMESTAMPTZ
);

CREATE INDEX "job_roles_tenant_id_department_id_idx" ON "job_roles"("tenant_id", "department_id");

CREATE TABLE "workers" (
    "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"    UUID NOT NULL REFERENCES "tenants"("id"),
    "job_role_id"  UUID NOT NULL REFERENCES "job_roles"("id"),
    "name"         TEXT NOT NULL,
    "email"        TEXT,
    "registration" TEXT,
    "is_active"    BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"   TIMESTAMPTZ
);

CREATE INDEX "workers_tenant_id_job_role_id_idx" ON "workers"("tenant_id", "job_role_id");

-- ============================================================
-- ASSESSMENTS
-- ============================================================

CREATE TABLE "assessments" (
    "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"       UUID NOT NULL REFERENCES "tenants"("id"),
    "organization_id" UUID NOT NULL REFERENCES "organizations"("id"),
    "responsible_id"  UUID REFERENCES "users"("id"),
    "title"           TEXT NOT NULL,
    "scope"           TEXT,
    "methodology"     TEXT,
    "status"          "assessment_status" NOT NULL DEFAULT 'draft',
    "started_at"      TIMESTAMPTZ,
    "completed_at"    TIMESTAMPTZ,
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at"      TIMESTAMPTZ
);

CREATE INDEX "assessments_tenant_id_organization_id_idx" ON "assessments"("tenant_id", "organization_id");
CREATE INDEX "assessments_tenant_id_status_idx" ON "assessments"("tenant_id", "status");

CREATE TABLE "activities" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id" UUID NOT NULL REFERENCES "assessments"("id"),
    "job_role_id"   UUID REFERENCES "job_roles"("id"),
    "name"          TEXT NOT NULL,
    "description"   TEXT,
    "worker_count"  INT,
    "work_shift"    TEXT,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "activities_tenant_id_assessment_id_idx" ON "activities"("tenant_id", "assessment_id");

-- ============================================================
-- FIELD DATA COLLECTION
-- ============================================================

CREATE TABLE "observations" (
    "id"                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"            UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id"        UUID NOT NULL REFERENCES "assessments"("id"),
    "activity_id"          UUID REFERENCES "activities"("id"),
    "observed_by"          UUID NOT NULL REFERENCES "users"("id"),
    "observed_at"          TIMESTAMPTZ NOT NULL,
    "description"          TEXT NOT NULL,
    "work_conditions"      TEXT,
    "worker_count_present" INT,
    "location"             TEXT,
    "created_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "observations_tenant_id_assessment_id_idx" ON "observations"("tenant_id", "assessment_id");
CREATE INDEX "observations_tenant_id_activity_id_idx" ON "observations"("tenant_id", "activity_id");

CREATE TABLE "interviews" (
    "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"        UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id"    UUID NOT NULL REFERENCES "assessments"("id"),
    "interviewee_name" TEXT NOT NULL,
    "interviewee_role" TEXT,
    "conducted_by"     UUID NOT NULL REFERENCES "users"("id"),
    "conducted_at"     TIMESTAMPTZ NOT NULL,
    "answers"          JSONB,
    "notes"            TEXT,
    "created_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "interviews_tenant_id_assessment_id_idx" ON "interviews"("tenant_id", "assessment_id");

-- ============================================================
-- HAZARD CATALOG & HAZARDS
-- ============================================================

CREATE TABLE "hazard_catalog" (
    "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"           UUID REFERENCES "tenants"("id"),
    "category"            "hazard_category" NOT NULL,
    "name"                TEXT NOT NULL,
    "description"         TEXT,
    "possible_consequences" TEXT,
    "suggested_controls"  TEXT,
    "is_global"           BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "hazard_catalog_tenant_id_idx" ON "hazard_catalog"("tenant_id");
CREATE INDEX "hazard_catalog_category_idx" ON "hazard_catalog"("category");

CREATE TABLE "hazards" (
    "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"           UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id"       UUID NOT NULL REFERENCES "assessments"("id"),
    "activity_id"         UUID REFERENCES "activities"("id"),
    "catalog_id"          UUID REFERENCES "hazard_catalog"("id"),
    "name"                TEXT NOT NULL,
    "description"         TEXT,
    "category"            "hazard_category" NOT NULL,
    "exposure_description" TEXT,
    "exposed_worker_count" INT,
    "existing_controls"   TEXT,
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "hazards_tenant_id_assessment_id_idx" ON "hazards"("tenant_id", "assessment_id");
CREATE INDEX "hazards_tenant_id_category_idx" ON "hazards"("tenant_id", "category");

-- ============================================================
-- RISK MATRIX
-- ============================================================

CREATE TABLE "risk_matrices" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"  UUID NOT NULL REFERENCES "tenants"("id"),
    "name"       TEXT NOT NULL,
    "version"    TEXT NOT NULL DEFAULT '1.0',
    "is_default" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "risk_matrices_tenant_id_idx" ON "risk_matrices"("tenant_id");

CREATE TABLE "severity_levels" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "risk_matrix_id" UUID NOT NULL REFERENCES "risk_matrices"("id"),
    "code"           TEXT NOT NULL,
    "name"           TEXT NOT NULL,
    "weight"         INT NOT NULL,
    "description"    TEXT,
    UNIQUE ("risk_matrix_id", "code")
);

CREATE TABLE "probability_levels" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "risk_matrix_id" UUID NOT NULL REFERENCES "risk_matrices"("id"),
    "code"           TEXT NOT NULL,
    "name"           TEXT NOT NULL,
    "weight"         INT NOT NULL,
    "description"    TEXT,
    UNIQUE ("risk_matrix_id", "code")
);

CREATE TABLE "risk_classifications" (
    "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "risk_matrix_id"   UUID NOT NULL REFERENCES "risk_matrices"("id"),
    "severity_code"    TEXT NOT NULL,
    "probability_code" TEXT NOT NULL,
    "result"           "risk_level" NOT NULL,
    UNIQUE ("risk_matrix_id", "severity_code", "probability_code")
);

-- ============================================================
-- RISK ASSESSMENTS
-- ============================================================

CREATE TABLE "risk_assessments" (
    "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"           UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id"       UUID NOT NULL REFERENCES "assessments"("id"),
    "hazard_id"           UUID NOT NULL REFERENCES "hazards"("id"),
    "severity"            "risk_severity" NOT NULL,
    "probability"         "risk_probability" NOT NULL,
    "risk_score"          INT NOT NULL,
    "risk_level"          "risk_level" NOT NULL,
    "residual_severity"   "risk_severity",
    "residual_probability" "risk_probability",
    "residual_score"      INT,
    "residual_level"      "risk_level",
    "justification"       TEXT,
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "risk_assessments_tenant_id_assessment_id_idx" ON "risk_assessments"("tenant_id", "assessment_id");
CREATE INDEX "risk_assessments_tenant_id_hazard_id_idx" ON "risk_assessments"("tenant_id", "hazard_id");
CREATE INDEX "risk_assessments_tenant_id_risk_level_idx" ON "risk_assessments"("tenant_id", "risk_level");

-- ============================================================
-- ACTION PLANS
-- ============================================================

CREATE TABLE "action_plans" (
    "id"                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"          UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id"      UUID NOT NULL REFERENCES "assessments"("id"),
    "risk_assessment_id" UUID REFERENCES "risk_assessments"("id"),
    "title"              TEXT NOT NULL,
    "objective"          TEXT,
    "created_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "action_plans_tenant_id_assessment_id_idx" ON "action_plans"("tenant_id", "assessment_id");

CREATE TABLE "action_items" (
    "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"         UUID NOT NULL REFERENCES "tenants"("id"),
    "action_plan_id"    UUID NOT NULL REFERENCES "action_plans"("id"),
    "action"            TEXT NOT NULL,
    "responsible_name"  TEXT NOT NULL,
    "due_date"          DATE NOT NULL,
    "status"            "action_item_status" NOT NULL DEFAULT 'pending',
    "success_indicators" TEXT,
    "completed_at"      TIMESTAMPTZ,
    "created_at"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "action_items_tenant_id_action_plan_id_idx" ON "action_items"("tenant_id", "action_plan_id");
CREATE INDEX "action_items_tenant_id_status_idx" ON "action_items"("tenant_id", "status");
CREATE INDEX "action_items_tenant_id_due_date_idx" ON "action_items"("tenant_id", "due_date");

-- ============================================================
-- SURVEYS
-- ============================================================

CREATE TABLE "surveys" (
    "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"           UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id"       UUID NOT NULL REFERENCES "assessments"("id"),
    "target_job_role_id"  UUID REFERENCES "job_roles"("id"),
    "title"               TEXT NOT NULL,
    "description"         TEXT,
    "is_anonymous"        BOOLEAN NOT NULL DEFAULT TRUE,
    "access_token"        TEXT NOT NULL UNIQUE,
    "closes_at"           TIMESTAMPTZ,
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "surveys_tenant_id_assessment_id_idx" ON "surveys"("tenant_id", "assessment_id");

CREATE TABLE "survey_responses" (
    "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"       UUID NOT NULL REFERENCES "tenants"("id"),
    "survey_id"       UUID NOT NULL REFERENCES "surveys"("id"),
    "respondent_hash" TEXT,
    "answers"         JSONB NOT NULL,
    "submitted_at"    TIMESTAMPTZ NOT NULL,
    "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "survey_responses_tenant_id_survey_id_idx" ON "survey_responses"("tenant_id", "survey_id");

-- ============================================================
-- FILES
-- ============================================================

CREATE TABLE "files" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL REFERENCES "tenants"("id"),
    "uploaded_by"   UUID NOT NULL REFERENCES "users"("id"),
    "reference_id"  UUID NOT NULL,
    "context"       "file_context" NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type"     TEXT NOT NULL,
    "size_bytes"    INT NOT NULL,
    "storage_key"   TEXT NOT NULL,
    "public_url"    TEXT,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "files_tenant_id_reference_id_idx" ON "files"("tenant_id", "reference_id");
CREATE INDEX "files_tenant_id_context_idx" ON "files"("tenant_id", "context");

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE "reports" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL REFERENCES "tenants"("id"),
    "assessment_id" UUID NOT NULL REFERENCES "assessments"("id"),
    "requested_by"  UUID NOT NULL REFERENCES "users"("id"),
    "type"          "report_type" NOT NULL,
    "format"        "report_format" NOT NULL,
    "status"        "report_status" NOT NULL DEFAULT 'queued',
    "file_key"      TEXT,
    "file_url"      TEXT,
    "error_message" TEXT,
    "completed_at"  TIMESTAMPTZ,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "reports_tenant_id_assessment_id_idx" ON "reports"("tenant_id", "assessment_id");
CREATE INDEX "reports_tenant_id_status_idx" ON "reports"("tenant_id", "status");

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE "audit_logs" (
    "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL REFERENCES "tenants"("id"),
    "user_id"       UUID REFERENCES "users"("id"),
    "user_name"     TEXT,
    "action"        TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id"   UUID,
    "metadata"      JSONB,
    "ip_address"    TEXT,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "audit_logs_tenant_id_user_id_idx" ON "audit_logs"("tenant_id", "user_id");
CREATE INDEX "audit_logs_tenant_id_resource_idx" ON "audit_logs"("tenant_id", "resource_type", "resource_id");
CREATE INDEX "audit_logs_tenant_id_created_at_idx" ON "audit_logs"("tenant_id", "created_at");
