import type { FastifyInstance } from 'fastify'
import { collectionRepository } from './collection.repository'
import { publishToQueue, QUEUES } from '../../infrastructure/rabbitmq'
import { ConflictError, NotFoundError } from '../../shared/errors'
import type { ICollection } from './collection.model'
import type { CollectionStatus } from '../../shared/types'

interface AddBookInput {
  googleId: string
  title: string
  authors: string[]
  thumbnail: string
  status?: CollectionStatus
}

interface UpdateBookInput {
  status?: CollectionStatus
  rating?: number
  notes?: string
}

export const collectionService = {
  async addBook(
    app: FastifyInstance,
    userId: string,
    data: AddBookInput,
  ): Promise<ICollection> {
    try {
      const item = await collectionRepository.save({
        googleId: data.googleId,
        userId,
        title: data.title,
        authors: data.authors,
        thumbnail: data.thumbnail,
        status: data.status ?? 'want_to_read',
      })

      await publishToQueue(QUEUES.BOOK_ADDED, { googleId: data.googleId, userId })

      app.log.info({
        event: 'book_added_to_collection',
        userId,
        googleId: data.googleId,
        collectionId: item.id,
      })

      return item
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new ConflictError('Book already in your collection')
      }
      throw error
    }
  },

  async listByUser(userId: string): Promise<ICollection[]> {
    return collectionRepository.findByUser(userId)
  },

  async search(userId: string, query: string): Promise<ICollection[]> {
    return collectionRepository.searchByTitle(userId, query)
  },

  async update(
    app: FastifyInstance,
    id: string,
    userId: string,
    data: UpdateBookInput,
  ): Promise<ICollection> {
    const item = await collectionRepository.updateById(id, userId, data)
    if (!item) {
      throw new NotFoundError('Collection item')
    }
    app.log.info({ event: 'collection_item_updated', userId, collectionId: id })
    return item
  },

  async remove(app: FastifyInstance, id: string, userId: string): Promise<void> {
    const deleted = await collectionRepository.deleteById(id, userId)
    if (!deleted) {
      throw new NotFoundError('Collection item')
    }
    app.log.info({ event: 'collection_item_removed', userId, collectionId: id })
  },
}
