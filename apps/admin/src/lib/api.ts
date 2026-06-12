import { config } from './config'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, body.message ?? res.statusText)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export interface Invitation {
  id: string
  email: string
  firstName: string
  lastName: string
  specialty: string
  phone: string | null
  country: string | null
  clinic: string | null
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  expiresAt: string
  createdAt: string
  createdById: string
}

export interface InvitationsResponse {
  data: Invitation[]
  total: number
  page: number
  limit: number
}

export interface CreateInvitationDto {
  email: string
  firstName: string
  lastName: string
  specialty: string
  phone?: string
  country?: string
  clinic?: string
  note?: string
}

export const invitationsApi = {
  list: (
    token: string,
    params: { page?: number; limit?: number; status?: string } = {},
  ) => {
    const qs = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
      ...(params.status ? { status: params.status } : {}),
    })
    return request<InvitationsResponse>(`/invitations?${qs}`, {}, token)
  },

  create: (token: string, data: CreateInvitationDto) =>
    request<{ message: string; email: string; expiresAt: string }>(
      '/invitations',
      { method: 'POST', body: JSON.stringify(data) },
      token,
    ),

  resend: (token: string, id: string) =>
    request<{ message: string }>(
      `/invitations/${id}/resend`,
      { method: 'PATCH' },
      token,
    ),

  cancel: (token: string, id: string) =>
    request<void>(`/invitations/${id}`, { method: 'DELETE' }, token),
}
