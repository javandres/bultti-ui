import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { GRAPHQL_PATH, SERVER_URL } from './constants'
import HistoryContext, { history } from './utils/history'
import { AppState } from './state/state'

const client = createClient({
  url: SERVER_URL + GRAPHQL_PATH,
  exchanges: [
    dedupExchange,
    // Replace the default cacheExchange with the new one
    cacheExchange({
      schema: require('./graphql.schema.json'),
    }),
    fetchExchange,
  ],
})

ReactDOM.render(
  <HistoryContext.Provider value={history}>
    <Provider value={client}>
      <AppState>
        <App />
      </AppState>
    </Provider>
  </HistoryContext.Provider>,
  document.getElementById('root')
)
