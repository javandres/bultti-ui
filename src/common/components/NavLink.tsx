import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Link, LinkProps, useLocation } from '@reach/router'
import { pathWithQuery } from '../../util/urlValue'

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

const NavLink: React.FC<PropTypes> = observer(({ to, children, ...props }) => {
  let location = useLocation()
  let queryPath = pathWithQuery(to, location)

  return (
    <NavLinkView to={queryPath} {...props} ref={undefined}>
      {children}
    </NavLinkView>
  )
})

export default NavLink
