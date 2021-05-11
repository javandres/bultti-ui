import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { StateProvider } from './state/stateContext'
import { UnsavedChangesProvider, useGetUserConfirmation } from './util/promptUnsavedChanges'
import { BrowserRouter } from 'react-router-dom'

// Wrap Router like this to get access to the UnsavedFormsContext in order to reset
// dirty forms if the user decides to navigate away.
function RouterProvider({ children }) {
  let onUserConfirmation = useGetUserConfirmation()
  return <BrowserRouter getUserConfirmation={onUserConfirmation}>{children}</BrowserRouter>
}

const main = async () => {
  ReactDOM.render(
    <UnsavedChangesProvider>
      <RouterProvider>
        <StateProvider>
          <App />
        </StateProvider>
      </RouterProvider>
    </UnsavedChangesProvider>,
    document.getElementById('root')
  )
}

main()
