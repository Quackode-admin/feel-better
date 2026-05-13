// =============================================================================
// @feel-better/types — tipos compartidos entre frontend, backend y mobile
// =============================================================================
// REGLA: Este paquete NO tiene dependencias de runtime.
// Solo tipos, interfaces y enums puros de TypeScript.
// =============================================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum Role {
  ADMIN = 'admin',
  NUTRITIONIST = 'nutritionist',
  PATIENT = 'patient',
  GUARDIAN = 'guardian',
}

export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export enum NutritionPlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum DocumentType {
  LAB_RESULT = 'lab_result',
  MEDICAL_IMAGE = 'medical_image',
  PRESCRIPTION = 'prescription',
  CONSENT = 'consent',
  OTHER = 'other',
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserPayload {
  id: string
  email: string
  role: Role
  fullName: string
  avatarUrl?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditFields {
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  createdById?: string | null
  updatedById?: string | null
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ─── API Response envelope ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  error: null | ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ─── Patient ─────────────────────────────────────────────────────────────────

export interface PatientSummary {
  id: string
  fullName: string
  email: string
  gender: Gender
  birthDate: string
  heightCm: number
  isActive: boolean
  nutritionistId?: string
}

// ─── File upload ──────────────────────────────────────────────────────────────

export interface SignedUploadUrl {
  uploadUrl: string
  fileKey: string
  expiresAt: Date
}

export interface UploadedFile {
  fileKey: string
  signedUrl: string
  originalName: string
  mimeType: string
  sizeBytes: number
}
