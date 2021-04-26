import { FunctionMap } from './common'
import { Language } from '../util/translate'
import { Operator, Season, User } from '../schema-types'

export interface IAppState {
  user?: User
  globalOperator: Operator
  globalSeason: Season | string
  language: Language
  unsavedFormIds: string[]
  infoMessages: string[]
  errorMessages: string[]
}

export type Initializer<T = any> = (state: IAppState, initialData: IAppState) => T | Promise<T>

export interface UserActions extends FunctionMap {
  user: (User) => void
}

export type MessageActions = {
  add: (message: string) => void
  remove: (removeIdx: number) => void
}

export interface UIActions {
  globalOperator: (operator: Operator) => void
  globalSeason: (season: Season | string) => void
  appLoaded: () => void
  language: (setTo: Language) => void
  infoMessages: MessageActions
  errorMessages: MessageActions
  unsavedFormIds: (unsavedFormIds: string[]) => void
}

export type ActionMap = UserActions & UIActions

export type StoreContext = {
  state: IAppState
  actions: ActionMap
}
