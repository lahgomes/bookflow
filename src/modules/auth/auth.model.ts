import mongoose, { type Document, type Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  createdAt: Date
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema)
