export interface IAuthenticatedUser {
  email: string
  groups: string[]
  _test: boolean
}

export type User = IAuthenticatedUser | null
