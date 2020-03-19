export interface IAuthenticatedUser {
  email: string
}

export type AuthResponse = { isOk: boolean; email?: string,  } | null
