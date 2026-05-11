import type { GoogleBooksVolume, Book } from './google-books.types'

export const googleBooksMapper = {
  toBook(volume: GoogleBooksVolume): Book {
    const info = volume.volumeInfo
    return {
      googleId: volume.id,
      title: info.title ?? 'Unknown title',
      authors: info.authors ?? [],
      description: info.description ?? '',
      publishedDate: info.publishedDate ?? '',
      pageCount: info.pageCount ?? null,
      categories: info.categories ?? [],
      thumbnail: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? '',
      language: info.language ?? '',
      previewLink: info.previewLink ?? '',
    }
  },

  toBookList(volumes: GoogleBooksVolume[]): Book[] {
    return volumes.map((v) => googleBooksMapper.toBook(v))
  },
}
