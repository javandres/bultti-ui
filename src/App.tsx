import React from 'react'
import { AuthState, useAuth } from './utils/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './pages/Index'
import Vehicles from './pages/Vehicles'
import AuthGate from './pages/AuthGate'
import PreInspection from './pages/PreInspection'
import PostInspection from './pages/PostInspection'
import PreInspectionReports from './pages/PreInspectionReports'
import PostInspectionReports from './pages/PostInspectionReports'
import AppFrame from './components/AppFrame'
import CreatePreInspection from './pages/CreatePreInspection'

const App: React.FC = observer(() => {
  const authState = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return <AuthGate unauthenticated={authState === AuthState.UNAUTHENTICATED} />
  }

  return (
    <AppFrame>
      <Router>
        <Index path="/" />
        <Vehicles path="vehicles" />
        <PreInspection path="preinspection" />
        <CreatePreInspection path="preinspection/create" />
        <PreInspectionReports path="preinspection/reports" />
        <PostInspection path="postinspection" />
        <PostInspectionReports path="postinspection/reports" />
      </Router>
    </AppFrame>
  )
})

export default App
