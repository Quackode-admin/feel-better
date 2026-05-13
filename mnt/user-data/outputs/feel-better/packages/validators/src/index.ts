// =============================================================================
// @feel-better/validators — schemas Zod compartidos
// =============================================================================
// Usados tanto en el frontend (React Hook Form) como en el backend (NestJS pipes)
// =============================================================================

export { createPatientSchema, updatePatientSchema, patientQuerySchema } from './patient.schema'
export type { CreatePatientInput, UpdatePatientInput, PatientQueryInput } from './patient.schema'

export { loginSchema, registerSchema, refreshTokenSchema } from './auth.schema'
export type { LoginInput, RegisterInput, RefreshTokenInput } from './auth.schema'

export { paginationSchema } from './pagination.schema'
export type { PaginationInput } from './pagination.schema'
