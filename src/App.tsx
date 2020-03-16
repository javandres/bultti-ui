import React from 'react'
import { AuthState, useAuth } from './utils/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './pages/Index'
import AuthGate from './pages/AuthGate'
import PreInspection from './pages/PreInspection'
import PostInspection from './pages/PostInspection'
import PreInspectionReports from './pages/PreInspectionReports'
import PostInspectionReports from './pages/PostInspectionReports'
import AppFrame from './common/components/AppFrame'
import CreatePreInspection from './pages/CreatePreInspection'
import ProcurementUnitsPage from './pages/ProcurementUnitsPage'

const App: React.FC = observer(() => {
  const authState = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return <AuthGate unauthenticated={authState === AuthState.UNAUTHENTICATED} />
  }

  return (
    <AppFrame>
      <Router>
        <Index path="/" />
        <ProcurementUnitsPage path="procurement-units" />
        <PreInspection path="pre-inspection" />
        <CreatePreInspection path="pre-inspection/create" />
        <PreInspectionReports path="pre-inspection/reports" />
        <PostInspection path="post-inspection" />
        <PostInspectionReports path="postinspection/reports" />
      </Router>
    </AppFrame>
  )
})

export default App
