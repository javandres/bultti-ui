import { User } from './authentication'
import { FunctionMap } from './common'
import { Language } from '../utils/translate'

export interface IAppState {
  user?: User
  globalOperatorFilter?: string
  language?: Language
}

export type Initializer<T = any> = (state: IAppState, initialData: IAppState) => T | Promise<T>

export interface UserActions extends FunctionMap {
  user: (User) => void
}

export interface UIActions extends FunctionMap {
  globalOperatorFilter: (string) => void
  appLoaded: () => void
  language: (setTo: Language) => void
}

export type ActionMap = UserActions & UIActions

export type StoreContext = {
  state: IAppState
  actions: ActionMap
}
