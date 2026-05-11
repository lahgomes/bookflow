import type { FastifyRequest, FastifyReply } from 'fastify'

export type CollectionStatus = 'want_to_read' | 'reading' | 'read'

// Minimal logger interface satisfied by both FastifyBaseLogger (app.log) and pino.Logger (worker)
export interface AppLogger {
  info(obj: object, msg?: string): void
  warn(obj: object, msg?: string): void
  error(obj: object, msg?: string): void
}

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
