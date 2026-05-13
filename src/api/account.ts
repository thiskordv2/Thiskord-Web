import { api } from '@/lib/axios'
import type { User, UpdateAccountRequest } from '@/types'

type RawUser = {
  user_id?: number
  id?: number
  user_name?: string | null
  user_mail?: string | null
  user_picture?: string | null
}

const mapUser = (user: RawUser): User => ({
  user_id: user.user_id ?? user.id ?? 0,
  user_name: user.user_name ?? '',
  user_mail: user.user_mail ?? '',
  user_picture: user.user_picture ?? '',
})

export const accountApi = {
  /** GET /api/Account/account/:id */
  getById: async (id: number): Promise<User> => {
    const res = await api.get<RawUser>(`/Account/account/${id}`)
    return mapUser(res.data)
  },

  /** POST /api/Account/account — met à jour nom, email, avatar */
  update: async (data: UpdateAccountRequest): Promise<void> => {
    await api.post('/Account/account', data)
  },

  /** POST /api/Account/account-password — met à jour le mot de passe */
  updatePassword: async (data: UpdateAccountRequest): Promise<void> => {
    await api.post('/Account/account-password', data)
  },

  /** GET /api/User/all */
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<RawUser[]>('/User/all')
    return res.data.map(mapUser)
  },
}