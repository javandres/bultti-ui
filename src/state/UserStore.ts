import { User } from '../types/authentication'
import { action, extendObservable } from 'mobx'

interface UserState {
  user: User
}

export interface UserActions {
  user: (User) => void
}

export const UserStore = (state) => {
  const defaultState: UserState = {
    user: null,
  }

  extendObservable(state, defaultState)

  const setUser = action((user: User) => {
    state.user = user
  })

  return {
    user: setUser,
  }
}
