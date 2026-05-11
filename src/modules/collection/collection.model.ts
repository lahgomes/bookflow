import mongoose, { type Document, type Model } from 'mongoose'
import type { CollectionStatus } from '../../shared/types'

export interface EnrichedData {
  description: string
  pageCount: number | null
  categories: string[]
  publishedDate: string
  language: string
  previewLink: string
}

export interface ICollection extends Document {
  googleId: string
  userId: mongoose.Types.ObjectId
  title: string
  authors: string[]
  thumbnail: string
  status: CollectionStatus
  rating?: number
  notes?: string
  enriched: boolean
  enrichedData?: EnrichedData
  createdAt: Date
  updatedAt: Date
}

const collectionSchema = new mongoose.Schema<ICollection>(
  {
    googleId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    authors: [{ type: String }],
    thumbnail: { type: String, default: '' },
    status: {
      type: String,
      enum: ['want_to_read', 'reading', 'read'],
      default: 'want_to_read',
    },
    rating: { type: Number, min: 1, max: 5 },
    notes: { type: String, default: '' },
    enriched: { type: Boolean, default: false },
    enrichedData: {
      description: { type: String },
      pageCount: { type: Number },
      categories: [{ type: String }],
      publishedDate: { type: String },
      language: { type: String },
      previewLink: { type: String },
    },
  },
  { timestamps: true },
)

// Prevents the same user from adding the same book twice
collectionSchema.index({ userId: 1, googleId: 1 }, { unique: true })

export const CollectionModel: Model<ICollection> = mongoose.model<ICollection>(
  'Collection',
  collectionSchema,
)
