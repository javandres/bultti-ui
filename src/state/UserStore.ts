import { action, extendObservable } from 'mobx'
import { UserActions } from '../types/state'
import { User } from '../schema-types'

interface UserState {
  user: User | null
}

export const UserStore = (state): UserActions => {
  const defaultState: UserState = {
    user: null,
  }

  extendObservable(state, defaultState)

  const setUser = action((user: User | null) => {
    state.user = user
  })

  return {
    user: setUser,
  }
}
