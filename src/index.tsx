import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'

const client = createClient({
  url: 'http://localhost:4100/graphql',
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
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)
