import type { FastifyInstance } from 'fastify'
import { collectionController } from './collection.controller'
import { collectionSchemas } from './collection.schema'

export async function collectionRoutes(app: FastifyInstance): Promise<void> {
  // All collection routes require a valid JWT token
  const auth = { preHandler: [app.authenticate] }

  app.post<{ Body: Parameters<typeof collectionController.add>[1]['body'] }>(
    '/collection',
    {
      ...auth,
      schema: {
        tags: ['collection'],
        summary: 'Add a book to your collection',
        security: [{ bearerAuth: [] }],
        body: collectionSchemas.addBody,
        response: {
          201: collectionSchemas.itemResponse,
          409: collectionSchemas.errorResponse,
        },
      },
    },
    (request, reply) => collectionController.add(app, request as any, reply),
  )

  app.get(
    '/collection',
    {
      ...auth,
      schema: {
        tags: ['collection'],
        summary: 'List all books in your collection',
        security: [{ bearerAuth: [] }],
        response: { 200: collectionSchemas.listResponse },
      },
    },
    (request, reply) => collectionController.list(app, request, reply),
  )

  app.get<{ Querystring: { q: string } }>(
    '/collection/search',
    {
      ...auth,
      schema: {
        tags: ['collection'],
        summary: 'Search your collection by title',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          required: ['q'],
          properties: { q: { type: 'string', minLength: 1 } },
        },
        response: { 200: collectionSchemas.listResponse },
      },
    },
    (request, reply) => collectionController.search(app, request, reply),
  )

  app.put<{ Params: { id: string }; Body: { status?: string; rating?: number; notes?: string } }>(
    '/collection/:id',
    {
      ...auth,
      schema: {
        tags: ['collection'],
        summary: 'Update book status, rating or notes',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string' } },
        },
        body: collectionSchemas.updateBody,
        response: {
          200: collectionSchemas.itemResponse,
          404: collectionSchemas.errorResponse,
        },
      },
    },
    (request, reply) => collectionController.update(app, request as any, reply),
  )

  app.delete<{ Params: { id: string } }>(
    '/collection/:id',
    {
      ...auth,
      schema: {
        tags: ['collection'],
        summary: 'Remove a book from your collection',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string' } },
        },
        response: {
          204: { type: 'null' },
          404: collectionSchemas.errorResponse,
        },
      },
    },
    (request, reply) => collectionController.remove(app, request, reply),
  )
}
