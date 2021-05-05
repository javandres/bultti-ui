import { FunctionMap } from './common'
import { Language } from '../util/translate'
import { Operator, Season, User } from '../schema-types'

export type UINotification = {
  message: string
  type: 'error' | 'info'
}

export interface IAppState {
  user?: User
  globalOperator: Operator
  globalSeason: Season
  language: Language
  unsavedFormIds: string[]
  notifications: UINotification[]
}

export type Initializer<T = UIActions | UserActions> = (
  state: IAppState,
  initialData: Partial<IAppState>
) => T

export interface UserActions extends FunctionMap {
  user: (User) => void
}

export type MessageActions = {
  add: (message: UINotification) => void
  remove: (removeMessage: UINotification | number) => void
}

export interface UIActions {
  // Undefined or null operator or season will result in default value being set.
  globalOperator: (operator?: Operator | null) => void
  globalSeason: (season?: Season | null) => void
  appLoaded: () => void
  language: (setTo: Language) => void
  notifications: MessageActions
  unsavedFormIds: (unsavedFormIds: string[]) => void
}

export type ActionMap = UserActions & UIActions

export type StoreContext = {
  state: IAppState
  actions: ActionMap
}
