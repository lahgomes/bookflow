import fp from 'fastify-plugin'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import jwt from '@fastify/jwt'
import { env } from '../config/env'

export const jwtPlugin = fp(async (app: FastifyInstance) => {
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  })

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})
