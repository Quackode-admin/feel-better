import { API_URL } from '@/lib/config'

export async function getAppointmentsApi(token: string) {
  const res = await fetch(`${API_URL}/api/v1/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error cargando citas')
  return res.json()
}

export async function createAppointmentApi(token: string, data: any) {
  const res = await fetch(`${API_URL}/api/v1/appointments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? `Error ${res.status}`)
  }
  return res.json()
}

export async function updateAppointmentApi(token: string, id: string, data: any) {
  const res = await fetch(`${API_URL}/api/v1/appointments/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error actualizando cita')
  return res.json()
}
