import 'dotenv/config'

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  MONGODB_URI: requireEnv('MONGODB_URI'),
  RABBITMQ_URL: requireEnv('RABBITMQ_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  GOOGLE_BOOKS_API_KEY: process.env.GOOGLE_BOOKS_API_KEY ?? '',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
} as const
