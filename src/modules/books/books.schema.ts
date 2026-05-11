const bookProperties = {
  googleId: { type: 'string' },
  title: { type: 'string' },
  authors: { type: 'array', items: { type: 'string' } },
  description: { type: 'string' },
  publishedDate: { type: 'string' },
  pageCount: { type: ['number', 'null'] },
  categories: { type: 'array', items: { type: 'string' } },
  thumbnail: { type: 'string' },
  language: { type: 'string' },
  previewLink: { type: 'string' },
} as const

export const booksSchemas = {
  searchQuery: {
    type: 'object',
    required: ['q'],
    properties: {
      q: { type: 'string', minLength: 1 },
    },
  },

  searchResponse: {
    type: 'object',
    properties: {
      total: { type: 'number' },
      books: {
        type: 'array',
        items: {
          type: 'object',
          properties: bookProperties,
        },
      },
    },
  },

  bookResponse: {
    type: 'object',
    properties: bookProperties,
  },

  errorResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' },
    },
  },
} as const
