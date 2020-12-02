import React, { useEffect } from 'react'
import { AuthState, useAuth } from './util/useAuth'
import { observer } from 'mobx-react-lite'
import { Redirect, RouteComponentProps, Router } from '@reach/router'
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
import OperatorContractsListPage from './page/OperatorContractsListPage'
import EditContractPage from './page/EditContractPage'
import { PageTitle } from './common/components/PageTitle'
import { InspectionType } from './schema-types'
import { removeAuthToken } from './util/authToken'
import { useMutationData } from './util/useMutationData'
import { logoutMutation } from './common/query/authQueries'
import { pickGraphqlData } from './util/pickGraphqlData'
import { useStateValue } from './state/useAppState'
import { HeaderHeading } from './common/components/ExpandableSection'
import Loading from './common/components/Loading'
import InspectionDatePage from './page/InspectionDatePage'
import { requireAdminUser } from './util/userRoles'

const Todo: React.FC<RouteComponentProps> = () => {
  return (
    <Page>
      <PageTitle>TODO</PageTitle>
      Placeholder page for future planned content.
    </Page>
  )
}

const Logout: React.FC<RouteComponentProps> = () => {
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

  return <Redirect to="/" noThrow={true} />
}

const App: React.FC = observer(() => {
  const [authState, loading] = useAuth()
  const [user] = useStateValue('user')

  // Listen for the browser close event. Conditionally prompt user when needed.
  let [unsavedFormIds] = useStateValue('unsavedFormIds')
  useEffect(() => {
    let listener = (event: BeforeUnloadEvent) => {
      if (unsavedFormIds.length > 0) {
        event.preventDefault()
        // Chrome requires event.returnValue to be cleared.
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', listener)
    return () => window.removeEventListener('beforeunload', listener)
  })

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
        {requireAdminUser(user) && <InspectionDatePage path="inspection-date" />}
        <UserPage path="user" />
        <OperatorContractsListPage path="contract" />
        <EditContractPage path="contract/:contractId" />
        <Todo path="contracts" />
        <Logout path="logout" />
      </Router>
    </AppFrame>
  )
})

export default App
