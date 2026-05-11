// Types representing the raw Google Books API response structure
export interface GoogleBooksApiResponse {
  kind: string
  totalItems: number
  items?: GoogleBooksVolume[]
}

export interface GoogleBooksVolume {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    averageRating?: number
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    language?: string
    previewLink?: string
    infoLink?: string
  }
}

// Internal representation used across the app (not Google's raw format)
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
