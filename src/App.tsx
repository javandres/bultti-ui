import React from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './page/Index'
import AuthGate from './page/AuthGate'
import PreInspections from './page/PreInspections'
import PostInspection from './page/PostInspection'
import PreInspectionReports from './page/PreInspectionReports'
import PostInspectionReports from './page/PostInspectionReports'
import AppFrame from './common/components/AppFrame'
import SelectEditablePreInspection from './page/SelectEditablePreInspection'
import ProcurementUnitsPage from './page/ProcurementUnitsPage'
import EditPreInspection from './page/EditPreInspection'

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
        <PreInspections path="pre-inspection" />
        <SelectEditablePreInspection path="pre-inspection/edit" />
        <EditPreInspection path="pre-inspection/edit/:preInspectionId/*" />
        <PreInspectionReports path="pre-inspection/reports" />
        <PostInspection path="post-inspection" />
        <PostInspectionReports path="post-inspection/reports" />
      </Router>
    </AppFrame>
  )
})

export default App
