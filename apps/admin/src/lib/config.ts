export const config = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://api.feel-better.fit'
      : process.env.NODE_ENV === 'test'
      ? 'https://api.staging.feel-better.fit'
      : 'https://api.dev.feel-better.fit'),
} as const
