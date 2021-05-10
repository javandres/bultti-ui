import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { StoreContext } from '../type/state'
import { UserStore } from './UserStore'
import { UIStore } from './UIStore'
import { createState } from './createState'
import { removeAuthToken } from '../util/authToken'
import { createGraphqlClient } from '../graphqlClient'
import { ApolloProvider } from '@apollo/client'
import { useHistory } from 'react-router-dom'

export const StateContext = React.createContext<StoreContext | null>(null)

const initializers = [UserStore, UIStore]

export const StateProvider: React.FC = ({ children }) => {
  const history = useHistory()
  const state = useMemo(() => createState(history, initializers), [])

  const onAuthError = useCallback(() => {
    removeAuthToken()
    state.actions.user(null)
    state.actions.notifications.add({
      message: 'Authentication expired or invalid. Please log in again.',
      type: 'error',
    })
  }, [state])

  const graphqlClient = useMemo(() => createGraphqlClient(onAuthError), [])

  return (
    <StateContext.Provider value={state}>
      <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>
    </StateContext.Provider>
  )
}
