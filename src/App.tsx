import React from 'react'
import { AuthState, useAuth } from './utils/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './pages/Index'
import Vehicles from './pages/Vehicles'
import AppLoading from './pages/AppLoading'

const App: React.FC = observer(() => {
  const authState = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return <AppLoading showAuthModal={authState === AuthState.UNAUTHENTICATED} />
  }

  return (
    <Router>
      <Index path="/" />
      <Vehicles path="vehicles" />
    </Router>
  )
})

export default App
