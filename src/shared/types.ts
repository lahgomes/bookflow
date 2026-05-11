import type { FastifyRequest, FastifyReply } from 'fastify'

export type CollectionStatus = 'want_to_read' | 'reading' | 'read'

export interface JwtPayload {
  userId: string
  email: string
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload
    user: JwtPayload
  }
}
