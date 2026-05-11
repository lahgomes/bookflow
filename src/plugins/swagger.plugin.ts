import type { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Reading Service API',
        description: 'Book catalog API with Google Books integration, RabbitMQ messaging and JWT auth',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'auth', description: 'Authentication' },
        { name: 'books', description: 'Google Books search' },
        { name: 'collection', description: 'Personal book collection' },
      ],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
    },
  })
}
