import type { FastifyInstance } from 'fastify'
import { googleBooksClient } from '../../integrations/google-books/google-books.client'
import type { Book } from '../../integrations/google-books/google-books.types'

export const booksService = {
  async search(app: FastifyInstance, query: string): Promise<Book[]> {
    return googleBooksClient.search(query, app.log)
  },

  async getById(app: FastifyInstance, googleId: string): Promise<Book | null> {
    return googleBooksClient.getById(googleId, app.log)
  },
}
