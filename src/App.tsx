import React from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './page/Index'
import AuthGate from './page/AuthGate'
import PreInspection from './page/PreInspection'
import PostInspection from './page/PostInspection'
import PreInspectionReports from './page/PreInspectionReports'
import PostInspectionReports from './page/PostInspectionReports'
import AppFrame from './common/components/AppFrame'
import CreatePreInspection from './page/CreatePreInspection'
import ProcurementUnitsPage from './page/ProcurementUnitsPage'

const App: React.FC = observer(() => {
  const [authState, loading] = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return <AuthGate loading={loading} unauthenticated={authState === AuthState.UNAUTHENTICATED} />
  }

  return (
    <AppFrame>
      <Router>
        <Index path="/" />
        <ProcurementUnitsPage path="procurement-units" />
        <PreInspection path="pre-inspection" />
        <CreatePreInspection path="pre-inspection/create/*" />
        <PreInspectionReports path="pre-inspection/reports" />
        <PostInspection path="post-inspection" />
        <PostInspectionReports path="post-inspection/reports" />
      </Router>
    </AppFrame>
  )
})

export default App
