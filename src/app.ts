import Fastify, { type FastifyError } from 'fastify'
import { corsPlugin } from './plugins/cors.plugin'
import { swaggerPlugin } from './plugins/swagger.plugin'
import { jwtPlugin } from './plugins/jwt.plugin'
import { AppError } from './shared/errors'
import { authRoutes } from './modules/auth/auth.routes'
import { booksRoutes } from './modules/books/books.routes'

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
          : undefined,
    },
  })

  app.register(corsPlugin)
  app.register(swaggerPlugin)
  app.register(jwtPlugin)
  app.register(authRoutes)
  app.register(booksRoutes)

  app.setErrorHandler((rawError, request, reply) => {
    const error = rawError as FastifyError & AppError
    const statusCode = error.statusCode ?? 500

    if (statusCode >= 500) {
      app.log.error({
        event: 'unhandled_error',
        error: error.message,
        url: request.url,
        method: request.method,
      })
    }

    const isAppError = rawError instanceof AppError

    reply.status(statusCode).send({
      statusCode,
      error: error.name ?? 'InternalServerError',
      message: isAppError || statusCode < 500 ? error.message : 'Internal Server Error',
    })
  })

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
    })
  })

  app.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Health check',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    },
  )

  return app
}
