import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { HSLLogoNoText } from '../icon/HSLLogoNoText'
import { Link } from '@reach/router'
import { Search } from '../icon/Search'
import { Plus } from '../icon/Plus'
import { Menu } from '../icon/Menu'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import { UserIcon } from '../icon/UserIcon'
import GlobalOperatorFilter from './GlobalOperatorFilter'
import { Bus } from '../icon/Bus'
import GlobalSeasonFilter from './GlobalSeasonFilter'
import NavLink from './NavLink'
import { logoutMutation } from '../query/authQueries'
import { Button, ButtonSize } from './Button'
import { Text } from '../../util/translate'
import { useMutationData } from '../../util/useMutationData'
import { pickGraphqlData } from '../../util/pickGraphqlData'
import { removeAuthToken } from '../../util/authToken'
import { navigateWithQueryString } from '../../util/urlValue'
import Dropdown from '../input/Dropdown'
import { promptUnsavedChangesOnClickEvent } from '../../util/promptUnsavedChanges'
import { DEBUG } from '../../constants'
import { useHasAdminAccessRights } from '../../util/userRoles'
import { User } from '../../schema-types'

const AppSidebarView = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`

const HSLLogo = styled(HSLLogoNoText)`
  margin-right: 1rem;
  display: block;
`

const AppTitle = styled(Link)`
  padding: 2rem 1rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: background 0.1s ease-out, transform 0.1s ease-out;
  color: white;
  text-decoration: none;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
    transform: scale(1.025);
  }

  h1 {
    margin: 0;
  }
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
  text-decoration: none;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`

const UserDisplay = styled.div`
  margin-left: 0.5rem;
  font-size: 1rem;
`

const UserLink = styled(Link)`
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
`

const GlobalFilters = styled.div``

export const SidebarStyledSelect = styled(Dropdown)`
  > label {
    padding-left: 1rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--dark-blue);
    font-size: 0.875rem;
    text-transform: uppercase;
    color: #eeeeee;
  }

  > div {
    padding: 0 1rem 1rem;

    > button {
      border: 1px solid var(--dark-blue);
      &:hover {
        background: var(--lighter-grey);
        transition: 0s;
        > svg * {
          fill: var(--dark-grey);
        }
      }
    }
  }

  ul {
    left: 1rem;
    width: calc(100% - 2rem);
    background: var(--dark-grey);
    border: 1px solid var(--dark-blue);
    > li {
      color: white;
      font-size: 1rem;
    }
  }
`

export type AppSidebarProps = {
  children?: React.ReactNode
}

const AppSidebar: React.FC<AppSidebarProps> = observer(() => {
  const [user, setUser] = useStateValue<User>('user')
  let hasAdminAccess = useHasAdminAccessRights()

  let unsavedFormIdsState = useStateValue('unsavedFormIds')

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

  const onLogout = useCallback(async () => {
    navigateWithQueryString('/')

    const result = await logout()
    let isLoggedOut = pickGraphqlData(result.data)

    if (isLoggedOut) {
      removeAuthToken()
      setUser(null)
    }
  }, [])

  return (
    <AppSidebarView>
      <AppTitle onClick={promptUnsavedChangesOnClickEvent(unsavedFormIdsState)} to="/">
        <HSLLogo fill="white" height={40} />
        <h1>
          <Text>appName</Text>
        </h1>
      </AppTitle>
      <UserBar>
        {DEBUG ? (
          <UserLink onClick={promptUnsavedChangesOnClickEvent(unsavedFormIdsState)} to="user">
            {userContent}
          </UserLink>
        ) : (
          userContent
        )}
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
          <NavLink to="procurement-units">
            <Bus fill="white" width="1rem" height="1rem" />
            <Text>nav_editProcurementUnits</Text>
          </NavLink>
        </NavCategory>
        <NavCategory>
          <CategoryTitle>
            <Text>contracts</Text>
          </CategoryTitle>
          <NavLink to="contract">
            <Menu fill="white" width="1rem" height="1rem" />
            <Text>nav_editContracts</Text>
          </NavLink>
        </NavCategory>
        <NavCategory>
          <CategoryTitle>
            <Text>preInspection</Text>
          </CategoryTitle>
          <NavLink to="pre-inspection">
            <Search fill="white" width="1rem" height="1rem" />
            <Text>preInspections</Text>
          </NavLink>
          <NavLink to="pre-inspection/edit">
            <Plus fill="white" width="1rem" height="1rem" />
            <Text>nav_newPreInspection</Text>
          </NavLink>
          <NavLink to="pre-inspection/reports">
            <Menu fill="white" width="1rem" height="1rem" />
            <Text>reports</Text>
          </NavLink>
        </NavCategory>
        <NavCategory>
          <CategoryTitle>
            <Text>postInspection</Text>
          </CategoryTitle>
          <NavLink to="post-inspection">
            <Search fill="white" width="1rem" height="1rem" />
            <Text>postInspections</Text>
          </NavLink>
          <NavLink to="post-inspection/edit">
            <Plus fill="white" width="1rem" height="1rem" />
            <Text>nav_newPostInspection</Text>
          </NavLink>
          {hasAdminAccess && (
            <NavLink to="inspection-date">
              <Plus fill="white" width="1rem" height="1rem" />
              <Text>nav_editInspectionDates</Text>
            </NavLink>
          )}
          <NavLink to="post-inspection/reports">
            <Menu fill="white" width="1rem" height="1rem" />
            <Text>reports</Text>
          </NavLink>
        </NavCategory>
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
    </AppSidebarView>
  )
})

export default AppSidebar
