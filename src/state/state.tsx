import * as React from 'react'
import { IAppState } from '../types/state'
import { observer, useLocalStore } from 'mobx-react-lite'
import { createStore } from 'mobx-app'

export const state: IAppState = createStore({
  User: UserStore
}, {})
export const StateContext = React.createContext<IAppState>(state)

export const AppState = observer(({ children }) => {
  const appState = useLocalStore<IAppState>(() => state)
  return <StateContext.Provider value={appState}>{children}</StateContext.Provider>
})
