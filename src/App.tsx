import React from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
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
import PreInspectionReportIndexPage from './page/PreInspectionReportIndexPage'
import UserPage from './page/UserPage'
import InspectionUsersPage from './page/InspectionUsersPage'

const App: React.FC = observer(() => {
  const [authState, loading] = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return (
      <AuthGate loading={loading} unauthenticated={authState === AuthState.UNAUTHENTICATED} />
    )
  }

  return (
    <AppFrame isAuthenticated={authState === AuthState.AUTHENTICATED}>
      <Router>
        <Index path="/" />
        <ProcurementUnitsPage path="procurement-units" />
        <PreInspectionsPage path="pre-inspection" />
        <SelectPreInspectionPage path="pre-inspection/edit" />
        <EditPreInspectionPage path="pre-inspection/edit/:inspectionId/*" />
        <PreInspectionReportsPage path="pre-inspection/reports/:inspectionId" />
        <PreInspectionReportIndexPage path="pre-inspection/reports" />
        <PostInspection path="post-inspection" />
        <PostInspectionReportsPage path="post-inspection/reports" />
        <UserPage path="user" />
        <InspectionUsersPage path="inspection/users/:inspectionId" />
      </Router>
    </AppFrame>
  )
})

export default App
