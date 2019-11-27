import { IAuthenticatedUser, User } from '../types/authentication'
import { action, extendObservable } from 'mobx'

interface UserState {
  user: User
}

export const UserStore = (state, initialState = {}) => {
  const defaultState: UserState = {
    user: null,
  }

  extendObservable(state, defaultState)

  const setUser = action((user: User) => {
    state.user = user
  })

  return {
    setUser,
  }
}
