import { User } from './authentication'
import { IObservableObject } from 'mobx'

export interface IAppState {
  user?: User
  vehicleFilter?: string
}

export type ObservableAppState = IAppState & IObservableObject

export interface FunctionMap {
  [name: string]: (...args: any[]) => any
}

export type Initializer<T = any> = (
  state: ObservableAppState,
  initialData: IAppState
) => T | Promise<T>

export interface UserActions extends FunctionMap {
  user: (User) => void
}

export interface UIActions extends FunctionMap {
  vehicleFilter: (string) => void
}

export type ActionMap = UserActions & UIActions

export type StoreContext = {
  state: ObservableAppState
  actions: ActionMap
}
