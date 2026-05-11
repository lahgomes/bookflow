import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { collectionService } from './collection.service'
import type { CollectionStatus } from '../../shared/types'

interface AddBookBody {
  googleId: string
  title: string
  authors: string[]
  thumbnail: string
  status?: CollectionStatus
}

interface UpdateBookBody {
  status?: CollectionStatus
  rating?: number
  notes?: string
}

export const collectionController = {
  async add(
    app: FastifyInstance,
    request: FastifyRequest<{ Body: AddBookBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { userId } = request.user
    const item = await collectionService.addBook(app, userId, request.body)
    reply.status(201).send(item)
  },

  async list(
    app: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { userId } = request.user
    const items = await collectionService.listByUser(userId)
    reply.send({ items, total: items.length })
  },

  async search(
    app: FastifyInstance,
    request: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { userId } = request.user
    const { q } = request.query
    const items = await collectionService.search(userId, q)
    reply.send({ items, total: items.length })
  },

  async update(
    app: FastifyInstance,
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateBookBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { userId } = request.user
    const { id } = request.params
    const item = await collectionService.update(app, id, userId, request.body)
    reply.send(item)
  },

  async remove(
    app: FastifyInstance,
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { userId } = request.user
    const { id } = request.params
    await collectionService.remove(app, id, userId)
    reply.status(204).send()
  },
}
