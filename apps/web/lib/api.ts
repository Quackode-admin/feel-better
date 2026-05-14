import { useAuth } from '@clerk/nextjs'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export function useApi() {
  const { getToken } = useAuth()

  async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken()
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    })
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
    return res.json() as Promise<T>
  }

  return { apiFetch }
}
