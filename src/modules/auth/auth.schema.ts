export const authSchemas = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
    },
  },

  tokenResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      userId: { type: 'string' },
      email: { type: 'string' },
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
