import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { pathWithQuery } from '../../util/urlValue'

export type PropTypes = LinkProps<unknown>

export const LinkWithQuery: React.FC<PropTypes> = observer(({ to, children, ...props }) => {
  let location = window.location
  let queryPath = pathWithQuery(to, location)

  return (
    <Link to={queryPath} {...props} ref={undefined}>
      {children}
    </Link>
  )
})

export default LinkWithQuery
