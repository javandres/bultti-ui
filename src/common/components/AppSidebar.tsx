import React from 'react'
import styled from 'styled-components'
import { Text } from '../../util/translate'
import { HSLLogoNoText } from '../icon/HSLLogoNoText'
import { Link } from '@reach/router'
import { Search } from '../icon/Search'
import { Plus } from '../icon/Plus'
import { Menu } from '../icon/Menu'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import { User } from '../icon/User'
import GlobalOperatorFilter from './GlobalOperatorFilter'
import { Bus } from '../icon/Bus'
import GlobalSeasonFilter from './GlobalSeasonFilter'
import NavLink from './NavLink'
import Dropdown from '../input/Dropdown'
import { promptUnsavedChangesOnClickEvent } from '../../util/promptUnsavedChanges'

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
`

const UserDisplay = styled.div`
  font-weight: bold;
  margin-left: 0.75rem;
  font-size: 0.875rem;
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
  }

  ul {
    left: 1rem;
    width: calc(100% - 2rem);
  }
`

/*const LangButton = styled(Button).attrs({
  small: true,
  transparent: true,
})<{ selected: boolean }>`
  background: ${(p) => (p.selected ? 'white' : 'transparent')};
  color: ${(p) => (p.selected ? 'var(--dark-blue)' : 'white')};
  padding: 0 0.55rem;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 0.875rem;
  font-weight: bold;

  &:hover {
    color: white;
  }
`*/

export type AppSidebarProps = {
  children?: React.ReactNode
}

const AppSidebar: React.FC<AppSidebarProps> = observer(() => {
  const [user] = useStateValue('user')
  let unsavedFormIdsState = useStateValue('unsavedFormIds')
  return (
    <AppSidebarView>
      <AppTitle onClick={promptUnsavedChangesOnClickEvent(unsavedFormIdsState)} to="/">
        <HSLLogo fill="white" height={40} />
        <h1>
          <Text>general.app.companyName</Text> <Text>general.app.title</Text>
        </h1>
      </AppTitle>
      <UserBar>
        <UserLink onClick={promptUnsavedChangesOnClickEvent(unsavedFormIdsState)} to="user">
          <User width="1rem" height="1rem" fill="white" />
          {user && <UserDisplay>{user?.email}</UserDisplay>}
        </UserLink>
      </UserBar>
      <GlobalFilters>
        <GlobalOperatorFilter />
        <GlobalSeasonFilter />
      </GlobalFilters>
      <AppNav>
        <NavCategory>
          <CategoryTitle>
            <Text>nav.category.procurementunits</Text>
          </CategoryTitle>
          <NavLink to="procurement-units">
            <Bus fill="white" width="1rem" height="1rem" />
            <Text>nav.list.procurementunits</Text>
          </NavLink>
        </NavCategory>
        <NavCategory>
          <CategoryTitle>
            <Text>nav.category.reports_contracts</Text>
          </CategoryTitle>
          <NavLink to="contract">
            <Menu fill="white" width="1rem" height="1rem" />
            <Text>nav.contracts.edit</Text>
          </NavLink>
        </NavCategory>
        <NavCategory>
          <CategoryTitle>
            <Text>nav.category.preinspection</Text>
          </CategoryTitle>
          <NavLink to="pre-inspection">
            <Search fill="white" width="1rem" height="1rem" />
            <Text>nav.list.preinspection</Text>
          </NavLink>
          <NavLink to="pre-inspection/edit">
            <Plus fill="white" width="1rem" height="1rem" />
            <Text>nav.new.preinspection</Text>
          </NavLink>
          <NavLink to="pre-inspection/reports">
            <Menu fill="white" width="1rem" height="1rem" />
            <Text>nav.reports</Text>
          </NavLink>
        </NavCategory>
        <NavCategory>
          <CategoryTitle>
            <Text>nav.category.postinspection</Text>
          </CategoryTitle>
          <NavLink to="post-inspection">
            <Search fill="white" width="1rem" height="1rem" />
            <Text>nav.list.postinspection</Text>
          </NavLink>
          <NavLink to="post-inspection/edit">
            <Plus fill="white" width="1rem" height="1rem" />
            <Text>nav.new.postinspection</Text>
          </NavLink>
          <NavLink to="inspection-date">
            <Plus fill="white" width="1rem" height="1rem" />
            <Text>nav.category.inspection_date</Text>
          </NavLink>
          <NavLink to="post-inspection/reports">
            <Menu fill="white" width="1rem" height="1rem" />
            <Text>nav.reports</Text>
          </NavLink>
        </NavCategory>
      </AppNav>
    </AppSidebarView>
  )
})

export default AppSidebar
