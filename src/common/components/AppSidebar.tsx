import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { HSLLogoNoText } from '../icon/HSLLogoNoText'
import { Search } from '../icon/Search'
import { Plus } from '../icon/Plus'
import { Menu } from '../icon/Menu'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import { UserIcon } from '../icon/UserIcon'
import GlobalOperatorFilter from './GlobalOperatorFilter'
import { Bus } from '../icon/Bus'
import GlobalSeasonFilter from './GlobalSeasonFilter'
import LinkWithQuery from './LinkWithQuery'
import { logoutMutation } from '../query/authQueries'
import { Button, ButtonSize } from './buttons/Button'
import { Text } from '../../util/translate'
import { useMutationData } from '../../util/useMutationData'
import { pickGraphqlData } from '../../util/pickGraphqlData'
import { removeAuthToken } from '../../util/authToken'
import { DEBUG } from '../../constants'
import { useHasAdminAccessRights, useIsTestUser } from '../../util/userRoles'
import { useNavigate } from '../../util/urlValue'

export const APP_TITLE_HEIGHT = 100

const AppSidebarView = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
`

const HSLLogo = styled(HSLLogoNoText)`
  margin-right: 1rem;
  display: block;
`

const AppTitle = styled(LinkWithQuery)`
  height: ${APP_TITLE_HEIGHT}px;
  padding: 2rem 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  transition: background 0.1s ease-out, transform 0.1s ease-out;
  color: white;
  text-decoration: none;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
    transform: scale(1.025);
  }

  h1 {
    margin: 0;
    white-space: nowrap;
  }
`

const SidebarScrollContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`

const AppNav = styled.nav`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`

const NavCategory = styled.div`
  margin-bottom: 2rem;
`

const CategoryTitle = styled.h3`
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #eeeeee;
  margin: 0;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  border-bottom: 1px solid var(--dark-blue);
`

const UserBar = styled.div`
  width: 100%;
  text-decoration: none;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`

const NavLink = styled(LinkWithQuery)`
  padding: 1.25rem 1rem 1.25rem 1rem;
  color: white;
  text-decoration: none;
  transition: background 0.1s ease-out, transform 0.1s ease-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
    transform: scale(1.025);
  }

  svg {
    display: block;
    margin-right: 0.75rem;
  }
`

const UserDisplay = styled.div`
  margin-left: 0.5rem;
  font-size: 0.875rem;
`

const UserLink = styled(LinkWithQuery)`
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
`

const GlobalFilters = styled.div``

export type AppSidebarProps = {
  children?: React.ReactNode
}

const AppSidebar: React.FC<AppSidebarProps> = observer(() => {
  const [user, setUser] = useStateValue('user')
  let hasAdminAccessRights = useHasAdminAccessRights()

  let userContent = (
    <>
      <UserIcon width="1rem" height="1rem" fill="white" />
      {user && (
        <UserDisplay data-cy="authInfo">
          <div data-cy="userEmail">{user?.email}</div>
          <div data-cy="userRole">
            <Text>{`role_${user?.role.toLowerCase()}`}</Text>
          </div>
        </UserDisplay>
      )}
    </>
  )

  const [logout, { loading: logoutLoading }] = useMutationData(logoutMutation)
  const navigate = useNavigate()

  const onLogout = useCallback(async () => {
    navigate.push('/')

    const result = await logout()
    let isLoggedOut = pickGraphqlData(result.data)

    if (isLoggedOut) {
      removeAuthToken()
      setUser(null)
    }
  }, [navigate])

  let isTestUser = useIsTestUser()

  return (
    <AppSidebarView>
      <AppTitle to="/">
        <HSLLogo fill="white" height={40} />
        <h1>
          <Text>appName</Text>
        </h1>
      </AppTitle>
      <SidebarScrollContainer>
        <UserBar>
          {DEBUG ? <UserLink to="/user">{userContent}</UserLink> : userContent}
        </UserBar>
        <GlobalFilters>
          <GlobalOperatorFilter />
          <GlobalSeasonFilter />
        </GlobalFilters>
        <AppNav>
          <NavCategory>
            <CategoryTitle>
              <Text>procurementUnits</Text>
            </CategoryTitle>
            <NavLink to="/procurement-units">
              <Bus fill="white" width="1rem" height="1rem" />
              <Text>nav_editProcurementUnits</Text>
            </NavLink>
          </NavCategory>
          <NavCategory>
            <CategoryTitle>
              <Text>contracts</Text>
            </CategoryTitle>
            <NavLink to="/contract">
              <Menu fill="white" width="1rem" height="1rem" />
              <Text>nav_editContracts</Text>
            </NavLink>
          </NavCategory>
          <NavCategory>
            <CategoryTitle>
              <Text>preInspection</Text>
            </CategoryTitle>
            <NavLink to="/pre-inspection">
              <Search fill="white" width="1rem" height="1rem" />
              <Text>preInspections</Text>
            </NavLink>
            <NavLink to="/pre-inspection/edit">
              <Plus fill="white" width="1rem" height="1rem" />
              <Text>nav_newPreInspection</Text>
            </NavLink>
            <NavLink to="/pre-inspection/reports">
              <Menu fill="white" width="1rem" height="1rem" />
              <Text>reports</Text>
            </NavLink>
          </NavCategory>
          <NavCategory>
            <CategoryTitle>
              <Text>postInspection</Text>
            </CategoryTitle>
            <NavLink to="/post-inspection">
              <Search fill="white" width="1rem" height="1rem" />
              <Text>postInspections</Text>
            </NavLink>
            <NavLink to="/post-inspection/edit">
              <Plus fill="white" width="1rem" height="1rem" />
              <Text>nav_newPostInspection</Text>
            </NavLink>
            {hasAdminAccessRights && (
              <NavLink to="/inspection-date">
                <Plus fill="white" width="1rem" height="1rem" />
                <Text>nav_editInspectionDates</Text>
              </NavLink>
            )}
            <NavLink to="/post-inspection/reports">
              <Menu fill="white" width="1rem" height="1rem" />
              <Text>reports</Text>
            </NavLink>
          </NavCategory>
          {hasAdminAccessRights && (
            <NavCategory>
              <CategoryTitle>
                <Text>maintenance</Text>
              </CategoryTitle>
              <NavLink to="/status">
                <div>System status</div>
              </NavLink>
              {isTestUser && (
                <NavLink to="/dev-tools">
                  <div>Dev tools</div>
                </NavLink>
              )}
            </NavCategory>
          )}
          <NavCategory>
            <Button
              style={{ color: 'white ', border: '1px solid white', margin: 'auto' }}
              loading={logoutLoading}
              onClick={onLogout}
              size={ButtonSize.MEDIUM}
              data-cy="logoutButton">
              <Text>logout</Text>
            </Button>
          </NavCategory>
        </AppNav>
      </SidebarScrollContainer>
    </AppSidebarView>
  )
})

export default AppSidebar
