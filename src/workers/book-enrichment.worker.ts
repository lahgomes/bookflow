import pino from 'pino'
import { env } from '../config/env'
import { connectMongoDB } from '../infrastructure/mongodb'
import { connectRabbitMQ, getChannel, QUEUES } from '../infrastructure/rabbitmq'
import { collectionRepository } from '../modules/collection/collection.repository'
import { googleBooksClient } from '../integrations/google-books/google-books.client'
import type { AppLogger } from '../shared/types'

const logger: AppLogger = pino({
  level: 'info',
  transport:
    env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
      : undefined,
})

interface BookAddedEvent {
  googleId: string
  userId: string
}

async function processBookAdded(event: BookAddedEvent): Promise<void> {
  const { googleId, userId } = event
  const start = Date.now()

  logger.info({ event: 'enrichment_started', googleId, userId })

  const book = await googleBooksClient.getById(googleId, logger)

  if (!book) {
    logger.warn({ event: 'enrichment_skipped', reason: 'book_not_found_on_google', googleId })
    return
  }

  await collectionRepository.updateEnrichment(googleId, {
    description: book.description,
    pageCount: book.pageCount,
    categories: book.categories,
    publishedDate: book.publishedDate,
    language: book.language,
    previewLink: book.previewLink,
  })

  const duration = Date.now() - start
  logger.info({ event: 'book_enriched', googleId, userId, durationMs: duration })
}

async function start(): Promise<void> {
  await connectMongoDB(logger)
  await connectRabbitMQ(logger)

  const channel = getChannel()
  logger.info({ event: 'worker_started', queue: QUEUES.BOOK_ADDED })

  channel.consume(QUEUES.BOOK_ADDED, async (msg) => {
    if (!msg) return

    try {
      const event = JSON.parse(msg.content.toString()) as BookAddedEvent
      await processBookAdded(event)
      channel.ack(msg)
    } catch (error) {
      logger.error({
        event: 'enrichment_failed',
        error: (error as Error).message,
        // In production: nack + dead letter queue for retry strategy
        // Here we ack to avoid infinite retry loop
      })
      channel.ack(msg)
    }
  })
}

start().catch((error) => {
  logger.error({ event: 'worker_startup_failed', error: (error as Error).message })
  process.exit(1)
})
