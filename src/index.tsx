import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { StateContext } from './state/stateContext'
import { UserStore } from './state/UserStore'
import { createState } from './state/createState'
import { UIStore } from './state/UIStore'
import { createGraphqlClient } from './graphqlClient'
import { ApolloProvider } from '@apollo/client'
import { LocationProvider } from '@reach/router'
import { history } from './util/urlValue'
import { removeAuthToken } from './util/authToken'

const initializers = [UserStore, UIStore]

const main = async () => {
  const state = await createState(initializers)

  let onAuthError = () => {
    removeAuthToken()
    state.actions.user(null)
    state.actions.notifications.add({
      message: 'Authentication expired or invalid. Please log in again.',
      type: 'error',
    })
  }

  const client = await createGraphqlClient(onAuthError)

  ReactDOM.render(
    <LocationProvider history={history}>
      <ApolloProvider client={client}>
        <StateContext.Provider value={state}>
          <App />
        </StateContext.Provider>
      </ApolloProvider>
    </LocationProvider>,
    document.getElementById('root')
  )
}

main()
