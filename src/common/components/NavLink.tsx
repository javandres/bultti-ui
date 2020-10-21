import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Link, LinkProps, useLocation } from '@reach/router'
import { pathWithQuery } from '../../util/urlValue'
import { useStateValue } from '../../state/useAppState'

export type PropTypes = LinkProps<any>

const NavLinkView = styled(Link)`
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
const DEFAULT_MESSAGE =
  'Sinulla on tallentamattomia muutoksia. Haluatko varmasti poistua näkymästä? Tallentamattomat muutokset kumotaan'

const NavLink: React.FC<PropTypes> = observer(({ to, children, ...props }) => {
  let location = useLocation()
  let queryPath = pathWithQuery(to, location)
  let [unsavedFormIds, setUnsavedFormIds] = useStateValue('unsavedFormIds')
  const onNavigationClick = (event: React.MouseEvent) => {
    if (unsavedFormIds?.length > 0) {
      if (window.confirm(DEFAULT_MESSAGE)) {
        setUnsavedFormIds([])
      } else {
        event.preventDefault()
      }
    }
  }
  return (
    <NavLinkView onClick={onNavigationClick} to={queryPath} {...props} ref={undefined}>
      {children}
    </NavLinkView>
  )
})

export default NavLink
