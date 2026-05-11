import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { booksService } from './books.service'
import { NotFoundError } from '../../shared/errors'

export const booksController = {
  async search(
    app: FastifyInstance,
    request: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { q } = request.query
    const books = await booksService.search(app, q)
    reply.send({ books, total: books.length })
  },

  async getById(
    app: FastifyInstance,
    request: FastifyRequest<{ Params: { googleId: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { googleId } = request.params
    const book = await booksService.getById(app, googleId)

    if (!book) {
      throw new NotFoundError('Book')
    }

    reply.send(book)
  },
}
