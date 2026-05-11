import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authController } from './auth.controller'
import { authSchemas } from './auth.schema'

interface AuthBody {
  email: string
  password: string
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: AuthBody }>(
    '/auth/register',
    {
      schema: {
        tags: ['auth'],
        summary: 'Register a new user',
        body: authSchemas.body,
        response: {
          201: authSchemas.tokenResponse,
          409: authSchemas.errorResponse,
        },
      },
    },
    (request, reply) => authController.register(app, request, reply),
  )

  app.post<{ Body: AuthBody }>(
    '/auth/login',
    {
      schema: {
        tags: ['auth'],
        summary: 'Login and receive a JWT token',
        body: authSchemas.body,
        response: {
          200: authSchemas.tokenResponse,
          401: authSchemas.errorResponse,
        },
      },
    },
    (request, reply) => authController.login(app, request, reply),
  )
}
