import type { FastifyBaseLogger } from 'fastify'
import { env } from '../../config/env'
import type { GoogleBooksApiResponse, GoogleBooksVolume } from './google-books.types'
import { googleBooksMapper } from './google-books.mapper'
import type { Book } from './google-books.types'

const BASE_URL = 'https://www.googleapis.com/books/v1'

function buildUrl(path: string, params: Record<string, string>): string {
  if (env.GOOGLE_BOOKS_API_KEY) {
    params.key = env.GOOGLE_BOOKS_API_KEY
  }
  const query = new URLSearchParams(params).toString()
  return `${BASE_URL}${path}?${query}`
}

export const googleBooksClient = {
  async search(query: string, logger: FastifyBaseLogger): Promise<Book[]> {
    const start = Date.now()
    const url = buildUrl('/volumes', { q: query, maxResults: '20', langRestrict: 'pt' })

    const response = await fetch(url)

    if (!response.ok) {
      logger.error({
        event: 'google_books_search_failed',
        status: response.status,
        query,
      })
      throw new Error(`Google Books API error: ${response.status}`)
    }

    const data = (await response.json()) as GoogleBooksApiResponse
    const duration = Date.now() - start

    logger.info({
      event: 'google_books_search',
      query,
      totalItems: data.totalItems,
      returned: data.items?.length ?? 0,
      durationMs: duration,
    })

    if (!data.items || data.items.length === 0) {
      return []
    }

    return googleBooksMapper.toBookList(data.items)
  },

  async getById(googleId: string, logger: FastifyBaseLogger): Promise<Book | null> {
    const start = Date.now()
    const url = buildUrl(`/volumes/${googleId}`, {})

    const response = await fetch(url)
    const duration = Date.now() - start

    if (response.status === 404) {
      logger.warn({ event: 'google_books_not_found', googleId, durationMs: duration })
      return null
    }

    if (!response.ok) {
      logger.error({
        event: 'google_books_fetch_failed',
        googleId,
        status: response.status,
        durationMs: duration,
      })
      throw new Error(`Google Books API error: ${response.status}`)
    }

    const volume = (await response.json()) as GoogleBooksVolume
    logger.info({ event: 'google_books_fetched', googleId, durationMs: duration })

    return googleBooksMapper.toBook(volume)
  },
}
