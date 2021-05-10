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
import { removeAuthToken } from './util/authToken'
import { UnsavedChangesProvider } from './util/promptUnsavedChanges'
import { history } from './util/urlValue'
import { Router } from 'react-router-dom'

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
    <ApolloProvider client={client}>
      <StateContext.Provider value={state}>
        <Router history={history}>
          <UnsavedChangesProvider>
            <App />
          </UnsavedChangesProvider>
        </Router>
      </StateContext.Provider>
    </ApolloProvider>,
    document.getElementById('root')
  )
}

main()
