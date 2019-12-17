import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'react-dates/initialize'
import App from './App'
import { StateContext } from './state/stateContext'
import { UserStore } from './state/UserStore'
import { createState } from './state/createState'
import { UIStore } from './state/UIStore'
import { createGraphqlClient } from './graphqlClient'
import { ApolloProvider } from '@apollo/react-hooks'

const initializers = [UserStore, UIStore]
;(async () => {
  const state = await createState(initializers)
  const client = await createGraphqlClient()

  ReactDOM.render(
    <ApolloProvider client={client}>
      <StateContext.Provider value={state}>
        <App />
      </StateContext.Provider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})()
