import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import { authRepository } from './auth.repository'
import { ConflictError, UnauthorizedError } from '../../shared/errors'

const SALT_ROUNDS = 12

export interface AuthTokenResponse {
  token: string
  userId: string
  email: string
}

export const authService = {
  async register(
    app: FastifyInstance,
    email: string,
    password: string,
  ): Promise<AuthTokenResponse> {
    const existing = await authRepository.findByEmail(email)
    if (existing) {
      throw new ConflictError('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await authRepository.create(email, passwordHash)

    app.log.info({ event: 'user_registered', userId: user.id, email })

    const token = app.jwt.sign({ userId: user.id, email: user.email })
    return { token, userId: user.id, email: user.email }
  },

  async login(
    app: FastifyInstance,
    email: string,
    password: string,
  ): Promise<AuthTokenResponse> {
    const user = await authRepository.findByEmail(email)
    if (!user) {
      app.log.warn({ event: 'login_failed', reason: 'user_not_found', email })
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      app.log.warn({ event: 'login_failed', reason: 'wrong_password', userId: user.id })
      throw new UnauthorizedError('Invalid credentials')
    }

    app.log.info({ event: 'user_logged_in', userId: user.id })

    const token = app.jwt.sign({ userId: user.id, email: user.email })
    return { token, userId: user.id, email: user.email }
  },
}
