import { CollectionModel, type ICollection, type EnrichedData } from './collection.model'
import type { CollectionStatus } from '../../shared/types'

interface SaveData {
  googleId: string
  userId: string
  title: string
  authors: string[]
  thumbnail: string
  status: CollectionStatus
}

interface UpdateData {
  status?: CollectionStatus
  rating?: number
  notes?: string
}

export const collectionRepository = {
  async save(data: SaveData): Promise<ICollection> {
    const item = new CollectionModel({ ...data, enriched: false })
    return item.save()
  },

  async findByUser(userId: string): Promise<ICollection[]> {
    return CollectionModel.find({ userId }).sort({ createdAt: -1 })
  },

  async searchByTitle(userId: string, query: string): Promise<ICollection[]> {
    return CollectionModel.find({
      userId,
      title: { $regex: query, $options: 'i' },
    }).sort({ createdAt: -1 })
  },

  async findById(id: string): Promise<ICollection | null> {
    return CollectionModel.findById(id)
  },

  async updateById(
    id: string,
    userId: string,
    data: UpdateData,
  ): Promise<ICollection | null> {
    return CollectionModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true },
    )
  },

  async deleteById(id: string, userId: string): Promise<boolean> {
    const result = await CollectionModel.deleteOne({ _id: id, userId })
    return result.deletedCount === 1
  },

  // Used by the enrichment worker: updates all entries with that googleId
  async updateEnrichment(googleId: string, enrichedData: EnrichedData): Promise<void> {
    await CollectionModel.updateMany(
      { googleId, enriched: false },
      { $set: { enriched: true, enrichedData } },
    )
  },
}
