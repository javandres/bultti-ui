import { User } from './authentication'
import { IObservableObject } from 'mobx'

export interface IAppState {
  user?: User
}

export type ObservableAppState = IAppState & IObservableObject

export type FunctionMap = { [name: string]: (...args: any[]) => any }

export type Initializer = (
  state: ObservableAppState,
  initialData: IAppState,
  key: string
) => FunctionMap | Promise<FunctionMap>

export type StateContextType = {
  state: ObservableAppState
  actions: FunctionMap
}
