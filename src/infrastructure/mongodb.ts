import mongoose from 'mongoose'
import type { FastifyBaseLogger } from 'fastify'
import { env } from '../config/env'

export async function connectMongoDB(logger: FastifyBaseLogger): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI)
    logger.info({ event: 'mongodb_connected' })
  } catch (error) {
    logger.error({ event: 'mongodb_connection_failed', error: (error as Error).message })
    throw error
  }
}
