import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { StateProvider } from './state/stateContext'
import { UnsavedChangesProvider } from './util/promptUnsavedChanges'
import { BrowserRouter } from 'react-router-dom'

const main = async () => {
  ReactDOM.render(
    <BrowserRouter>
      <StateProvider>
        <UnsavedChangesProvider>
          <App />
        </UnsavedChangesProvider>
      </StateProvider>
    </BrowserRouter>,
    document.getElementById('root')
  )
}

main()
