export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
