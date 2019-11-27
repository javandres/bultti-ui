export interface IAuthenticatedUser {
  email: string
  groups?: string[]
  _test?: boolean
}

export type User = IAuthenticatedUser | null

export type AuthResponse = { isOk: boolean; email?: string } | null
