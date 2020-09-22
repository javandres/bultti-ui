import React from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps, Router } from '@reach/router'
import Index from './page/Index'
import AuthGate from './page/AuthGate'
import InspectionsPage from './page/InspectionsPage'
import InspectionReportsPage from './page/InspectionReportsPage'
import AppFrame from './common/components/AppFrame'
import SelectInspectionPage from './page/SelectInspectionPage'
import ProcurementUnitsPage from './page/ProcurementUnitsPage'
import EditInspectionPage from './page/EditInspectionPage'
import InspectionReportIndexPage from './page/InspectionReportIndexPage'
import UserPage from './page/UserPage'
import ReportsPage from './page/ReportsPage'
import { Page } from './common/components/common'
import OperatorContractsListPage from './page/OperatorContractsListPage'
import EditContractPage from './page/EditContractPage'
import { PageTitle } from './common/components/PageTitle'
import { InspectionType } from './schema-types'

const Todo: React.FC<RouteComponentProps> = () => {
  return (
    <Page>
      <PageTitle>TODO</PageTitle>
      Placeholder page for future planned content.
    </Page>
  )
}

const App: React.FC = observer(() => {
  const [authState, loading] = useAuth()

  if (authState !== AuthState.AUTHENTICATED) {
    return (
      <AuthGate loading={loading} unauthenticated={authState === AuthState.UNAUTHENTICATED} />
    )
  }

  return (
    <AppFrame isAuthenticated={authState === AuthState.AUTHENTICATED}>
      <Router style={{ height: '100%' }}>
        <Index path="/" />
        <ProcurementUnitsPage path="procurement-units" />

        <InspectionsPage path="pre-inspection" inspectionType={InspectionType.Pre} />
        <SelectInspectionPage path="pre-inspection/edit" inspectionType={InspectionType.Pre} />
        <EditInspectionPage
          path="pre-inspection/edit/:inspectionId/*"
          inspectionType={InspectionType.Pre}
        />
        <InspectionReportsPage
          path="pre-inspection/reports/:inspectionId"
          inspectionType={InspectionType.Pre}
        />
        <InspectionReportIndexPage
          path="pre-inspection/reports"
          inspectionType={InspectionType.Pre}
        />

        <InspectionsPage path="post-inspection" inspectionType={InspectionType.Post} />
        <SelectInspectionPage
          path="post-inspection/edit"
          inspectionType={InspectionType.Post}
        />
        <EditInspectionPage
          path="post-inspection/edit/:inspectionId/*"
          inspectionType={InspectionType.Post}
        />
        <InspectionReportsPage
          path="post-inspection/reports/:inspectionId"
          inspectionType={InspectionType.Post}
        />
        <InspectionReportIndexPage
          path="post-inspection/reports"
          inspectionType={InspectionType.Post}
        />

        <UserPage path="user" />
        <OperatorContractsListPage path="contract" />
        <EditContractPage path="contract/:contractId" />
        <ReportsPage path="reports" />
        <Todo path="contracts" />
      </Router>
    </AppFrame>
  )
})

export default App
