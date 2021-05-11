import React from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { Prompt, Redirect, Route, Switch } from 'react-router-dom'
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
import ContractPage from './page/ContractPage'
import EditContractPage from './page/EditContractPage'
import InspectionDatePage from './page/InspectionDatePage'
import { useHasAdminAccessRights } from './util/userRoles'
import DevPage from './dev/DevPage'
import { InspectionType } from './schema-types'
import { DEBUG } from './constants'
import { useUnsavedChangesPrompt } from './util/promptUnsavedChanges'

const App: React.FC = observer(() => {
  const [authState, loading] = useAuth()
  const hasAdminAccessRights = useHasAdminAccessRights()

  const [promptCondition, promptMessage] = useUnsavedChangesPrompt()

  if (authState !== AuthState.AUTHENTICATED) {
    return (
      <AuthGate loading={loading} unauthenticated={authState === AuthState.UNAUTHENTICATED} />
    )
  }

  return (
    <AppFrame isAuthenticated={authState === AuthState.AUTHENTICATED}>
      <Prompt when={promptCondition} message={promptMessage} />
      <Switch>
        <Route exact component={Index} path="/" />
        <Route
          render={(routeProps) => (
            <EditInspectionPage inspectionType={InspectionType.Pre} {...routeProps} />
          )}
          path="/pre-inspection/edit/:inspectionId/*"
        />
        <Route
          render={(routeProps) => (
            <InspectionReportsPage inspectionType={InspectionType.Pre} {...routeProps} />
          )}
          path="/pre-inspection/reports/:inspectionId"
        />
        <Route
          render={(routeProps) => (
            <SelectInspectionPage inspectionType={InspectionType.Pre} {...routeProps} />
          )}
          path="/pre-inspection/edit"
        />
        <Route
          render={(routeProps) => (
            <InspectionReportIndexPage inspectionType={InspectionType.Pre} {...routeProps} />
          )}
          path="/pre-inspection/reports"
        />
        <Route
          render={(routeProps) => (
            <InspectionsPage inspectionType={InspectionType.Pre} {...routeProps} />
          )}
          path="/pre-inspection"
        />
        <Route
          render={(routeProps) => (
            <EditInspectionPage inspectionType={InspectionType.Post} {...routeProps} />
          )}
          path="/post-inspection/edit/:inspectionId/*"
        />
        <Route
          render={(routeProps) => (
            <InspectionReportsPage inspectionType={InspectionType.Post} {...routeProps} />
          )}
          path="/post-inspection/reports/:inspectionId"
        />
        <Route
          render={(routeProps) => (
            <SelectInspectionPage inspectionType={InspectionType.Post} {...routeProps} />
          )}
          path="/post-inspection/edit"
        />
        <Route
          render={(routeProps) => (
            <InspectionReportIndexPage inspectionType={InspectionType.Post} {...routeProps} />
          )}
          path="/post-inspection/reports"
        />
        <Route
          render={(routeProps) => (
            <InspectionsPage inspectionType={InspectionType.Post} {...routeProps} />
          )}
          path="/post-inspection"
        />
        {hasAdminAccessRights && (
          <Route component={InspectionDatePage} path="/inspection-date" />
        )}
        <Route
          path="/user"
          render={(routeProps) => (DEBUG ? <UserPage {...routeProps} /> : <Redirect to="/" />)}
        />
        <Route component={EditContractPage} path="/contract/:contractId" />
        <Route component={ContractPage} path="/contract" />
        <Route component={DevPage} path="/dev-tools" />
        <Route component={ProcurementUnitsPage} path="/procurement-units" />
      </Switch>
    </AppFrame>
  )
})

export default App
