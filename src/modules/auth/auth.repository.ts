import { UserModel, type IUser } from './auth.model'

export const authRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email })
  },

  async create(email: string, passwordHash: string): Promise<IUser> {
    const user = new UserModel({ email, passwordHash })
    return user.save()
  },

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id)
  },
}
