import { api } from '@/lib/axios'
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types'

type RawUser = {
  user_id?: number
  id?: number
  user_name?: string | null
  user_mail?: string | null
  user_picture?: string | null
}

type RawLoginResponse = {
  user?: RawUser | null
  token?: string | null
}

const mapUser = (user: RawUser | null | undefined) => ({
  user_id: user?.user_id ?? user?.id ?? 0,
  user_name: user?.user_name ?? '',
  user_mail: user?.user_mail ?? '',
  user_picture: user?.user_picture ?? '',
})

const mapLoginResponse = (response: RawLoginResponse): LoginResponse => ({
  user: mapUser(response.user),
  token: response.token ?? '',
})

export const authApi = {
  /**
   * POST /api/Auth/auth
   * Authentifie un utilisateur et retourne le JWT + infos user.
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<RawLoginResponse>('/Auth/auth', data)
    return mapLoginResponse(res.data)
  },

  /**
   * POST /api/Inscription/register
   * Crée un nouveau compte.
   */
  register: async (data: RegisterRequest): Promise<{ resultat: string }> => {
    const res = await api.post<{ resultat: string }>('/Inscription/register', data)
    return res.data
  },
}