import type { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { env } from '../config/env'

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: env.NODE_ENV === 'production' ? env.CORS_ORIGIN : true,
    credentials: true,
  })
}
