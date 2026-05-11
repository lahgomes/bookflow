import type { FastifyInstance } from 'fastify'
import { booksController } from './books.controller'
import { booksSchemas } from './books.schema'

export async function booksRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { q: string } }>(
    '/books/search',
    {
      schema: {
        tags: ['books'],
        summary: 'Search books via Google Books API',
        querystring: booksSchemas.searchQuery,
        response: {
          200: booksSchemas.searchResponse,
        },
      },
    },
    (request, reply) => booksController.search(app, request, reply),
  )

  app.get<{ Params: { googleId: string } }>(
    '/books/:googleId',
    {
      schema: {
        tags: ['books'],
        summary: 'Get book details by Google Books ID',
        params: {
          type: 'object',
          required: ['googleId'],
          properties: {
            googleId: { type: 'string' },
          },
        },
        response: {
          200: booksSchemas.bookResponse,
          404: booksSchemas.errorResponse,
        },
      },
    },
    (request, reply) => booksController.getById(app, request, reply),
  )
}
