const collectionItemProperties = {
  _id: { type: 'string' },
  googleId: { type: 'string' },
  userId: { type: 'string' },
  title: { type: 'string' },
  authors: { type: 'array', items: { type: 'string' } },
  thumbnail: { type: 'string' },
  status: { type: 'string', enum: ['want_to_read', 'reading', 'read'] },
  rating: { type: 'number', minimum: 1, maximum: 5 },
  notes: { type: 'string' },
  enriched: { type: 'boolean' },
  enrichedData: {
    type: 'object',
    properties: {
      description: { type: 'string' },
      pageCount: { type: 'number' },
      categories: { type: 'array', items: { type: 'string' } },
      publishedDate: { type: 'string' },
      language: { type: 'string' },
      previewLink: { type: 'string' },
    },
  },
  createdAt: { type: 'string' },
  updatedAt: { type: 'string' },
} as const

export const collectionSchemas = {
  addBody: {
    type: 'object',
    required: ['googleId', 'title'],
    properties: {
      googleId: { type: 'string' },
      title: { type: 'string' },
      authors: { type: 'array', items: { type: 'string' } },
      thumbnail: { type: 'string' },
      status: { type: 'string', enum: ['want_to_read', 'reading', 'read'] },
    },
  },

  updateBody: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['want_to_read', 'reading', 'read'] },
      rating: { type: 'number', minimum: 1, maximum: 5 },
      notes: { type: 'string' },
    },
  },

  itemResponse: {
    type: 'object',
    properties: collectionItemProperties,
  },

  listResponse: {
    type: 'object',
    properties: {
      total: { type: 'number' },
      items: {
        type: 'array',
        items: { type: 'object', properties: collectionItemProperties },
      },
    },
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
