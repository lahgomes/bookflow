import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authService } from './auth.service'

interface AuthBody {
  email: string
  password: string
}

export const authController = {
  async register(
    app: FastifyInstance,
    request: FastifyRequest<{ Body: AuthBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { email, password } = request.body
    const result = await authService.register(app, email, password)
    reply.status(201).send(result)
  },

  async login(
    app: FastifyInstance,
    request: FastifyRequest<{ Body: AuthBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { email, password } = request.body
    const result = await authService.login(app, email, password)
    reply.send(result)
  },
}
