import React from 'react'
import { AuthState, useAuth } from './utils/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './pages/Index'
import Vehicles from './pages/Vehicles'
import AuthGate from './pages/AuthGate'

const App: React.FC = observer(() => {
  const authState = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return <AuthGate unauthenticated={authState === AuthState.UNAUTHENTICATED} />
  }

  return (
    <Router>
      <Index path="/" />
      <Vehicles path="vehicles" />
    </Router>
  )
})

export default App
