export type CollectionStatus = 'want_to_read' | 'reading' | 'read'

export interface Book {
  googleId: string
  title: string
  authors: string[]
  description: string
  publishedDate: string
  pageCount: number | null
  categories: string[]
  thumbnail: string
  language: string
  previewLink: string
}

export interface CollectionItem {
  _id: string
  googleId: string
  title: string
  authors: string[]
  thumbnail: string
  status: CollectionStatus
  rating?: number
  notes?: string
  enriched: boolean
  enrichedData?: {
    description: string
    pageCount: number | null
    categories: string[]
    publishedDate: string
    language: string
    previewLink: string
  }
  createdAt: string
}

export interface AuthResponse {
  token: string
  userId: string
  email: string
}
