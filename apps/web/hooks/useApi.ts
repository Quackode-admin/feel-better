'use client'

import { useAuth } from '@clerk/nextjs'
import { useCallback } from 'react'

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'

export function useApi() {
  const { getToken } = useAuth()

  const request = useCallback(
    async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = await getToken()

      const response = await fetch(`${API_URL}/api/v1${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message ?? `Error ${response.status}`)
      }

      return response.json()
    },
    [getToken],
  )

  return { request }
}
