import React, { useEffect } from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
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
import { Page } from './common/components/common'
import ContractPage from './page/ContractPage'
import EditContractPage from './page/EditContractPage'
import { removeAuthToken } from './util/authToken'
import { useMutationData } from './util/useMutationData'
import { logoutMutation } from './common/query/authQueries'
import { pickGraphqlData } from './util/pickGraphqlData'
import { useStateValue } from './state/useAppState'
import { HeaderHeading } from './common/components/ExpandableSection'
import Loading from './common/components/Loading'
import InspectionDatePage from './page/InspectionDatePage'
import { useHasAdminAccessRights } from './util/userRoles'
import DevPage from './dev/DevPage'
import { InspectionType } from './schema-types'

const Logout: React.FC = () => {
  const [user, setUser] = useStateValue('user')
  const [logout, { loading: logoutLoading }] = useMutationData(logoutMutation)

  useEffect(() => {
    if (user) {
      logout().then((result) => {
        let isLoggedOut = pickGraphqlData(result.data)

        if (isLoggedOut) {
          setUser(null)
        }

        removeAuthToken()
      })
    } else {
      removeAuthToken()
    }
  }, [])

  if (user || logoutLoading) {
    return (
      <Page>
        <HeaderHeading>Kirjaudutaan ulos...</HeaderHeading>
        <Loading />
      </Page>
    )
  }

  return <Redirect to="/" />
}

const App: React.FC = observer(() => {
  const [authState, loading] = useAuth()
  const hasAdminAccessRights = useHasAdminAccessRights()

  if (authState !== AuthState.AUTHENTICATED) {
    return (
      <AuthGate loading={loading} unauthenticated={authState === AuthState.UNAUTHENTICATED} />
    )
  }

  return (
    <AppFrame isAuthenticated={authState === AuthState.AUTHENTICATED}>
      <Router>
        <Switch>
          <Route
            component={(routeProps) => (
              <EditInspectionPage inspectionType={InspectionType.Pre} {...routeProps} />
            )}
            path="/pre-inspection/edit/:inspectionId/*"
          />
          <Route
            component={(routeProps) => (
              <InspectionReportsPage inspectionType={InspectionType.Pre} {...routeProps} />
            )}
            path="/pre-inspection/reports/:inspectionId"
          />
          <Route
            component={(routeProps) => (
              <SelectInspectionPage inspectionType={InspectionType.Pre} {...routeProps} />
            )}
            path="/pre-inspection/edit"
          />
          <Route
            component={(routeProps) => (
              <InspectionReportIndexPage inspectionType={InspectionType.Pre} {...routeProps} />
            )}
            path="/pre-inspection/reports"
          />
          <Route
            component={(routeProps) => (
              <InspectionsPage inspectionType={InspectionType.Pre} {...routeProps} />
            )}
            path="/pre-inspection"
          />
          <Route
            component={(routeProps) => (
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
            component={(routeProps) => (
              <SelectInspectionPage inspectionType={InspectionType.Post} {...routeProps} />
            )}
            path="/post-inspection/edit"
          />
          <Route
            render={(routeProps) => (
              <InspectionReportIndexPage
                inspectionType={InspectionType.Post}
                {...routeProps}
              />
            )}
            path="/post-inspection/reports"
          />
          <Route
            component={(routeProps) => (
              <InspectionsPage inspectionType={InspectionType.Post} {...routeProps} />
            )}
            path="/post-inspection"
          />
          {hasAdminAccessRights && (
            <Route component={InspectionDatePage} path="/inspection-date" />
          )}
          <Route path="/user">
            {({ match }) => (match ? <UserPage /> : <Redirect from="user" to="/" />)}
          </Route>
          <Route component={EditContractPage} path="/contract/:contractId" />
          <Route component={ContractPage} path="/contract" />
          <Route component={DevPage} path="/dev-tools" />
          <Route component={ProcurementUnitsPage} path="/procurement-units" />
          <Route component={Logout} path="/logout" />
          <Route exact component={Index} path="/" />
        </Switch>
      </Router>
    </AppFrame>
  )
})

export default App
