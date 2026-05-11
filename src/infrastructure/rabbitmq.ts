import amqplib, { type Channel } from 'amqplib'
import type { FastifyBaseLogger } from 'fastify'
import { env } from '../config/env'

let channel: Channel

export const QUEUES = {
  BOOK_ADDED: 'book.added',
} as const

export async function connectRabbitMQ(logger: FastifyBaseLogger): Promise<void> {
  try {
    const connection = await amqplib.connect(env.RABBITMQ_URL)
    channel = await connection.createChannel()

    for (const queue of Object.values(QUEUES)) {
      await channel.assertQueue(queue, { durable: true })
    }

    logger.info({ event: 'rabbitmq_connected', queues: Object.values(QUEUES) })
  } catch (error) {
    logger.error({ event: 'rabbitmq_connection_failed', error: (error as Error).message })
    throw error
  }
}

export function getChannel(): Channel {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.')
  }
  return channel
}

export async function publishToQueue(queue: string, payload: object): Promise<void> {
  const ch = getChannel()
  const buffer = Buffer.from(JSON.stringify(payload))
  ch.sendToQueue(queue, buffer, { persistent: true })
}
