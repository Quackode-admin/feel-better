const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'

async function getToken(): Promise<string | null> {
  try {
    const { getToken } = await import('@clerk/nextjs/server')
    return null
  } catch {
    return null
  }
}

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
