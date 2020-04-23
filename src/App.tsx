import React from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { Router, Redirect } from '@reach/router'
import Index from './page/Index'
import AuthGate from './page/AuthGate'
import PreInspectionsPage from './page/PreInspectionsPage'
import PostInspection from './page/PostInspection'
import PreInspectionReportsPage from './page/PreInspectionReportsPage'
import PostInspectionReportsPage from './page/PostInspectionReportsPage'
import AppFrame from './common/components/AppFrame'
import SelectPreInspectionPage from './page/SelectPreInspectionPage'
import ProcurementUnitsPage from './page/ProcurementUnitsPage'
import EditPreInspectionPage from './page/EditPreInspectionPage'

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
        <PreInspectionsPage path="pre-inspection" />
        <SelectPreInspectionPage path="pre-inspection/edit" />
        <EditPreInspectionPage path="pre-inspection/edit/:preInspectionId/*" />
        <PreInspectionReportsPage path="pre-inspection/reports/:preInspectionId" />
        <Redirect from="pre-inspection/reports" to="pre-inspection" />
        <PostInspection path="post-inspection" />
        <PostInspectionReportsPage path="post-inspection/reports" />
      </Router>
    </AppFrame>
  )
})

export default App
