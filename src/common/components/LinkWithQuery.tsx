import React, { useMemo } from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getPathWithSearch } from '../../util/urlValue'

export type PropTypes = LinkProps<unknown>

export const LinkWithQuery: React.FC<PropTypes> = observer(({ to, children, ...props }) => {
  let location = useLocation()
  let queryPath = useMemo(() => getPathWithSearch(to, location), [location.search])

  return (
    <Link to={queryPath} {...props} ref={undefined}>
      {children}
    </Link>
  )
})

export default LinkWithQuery
