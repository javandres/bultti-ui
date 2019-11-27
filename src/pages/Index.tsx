import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from '@reach/router'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <div>
      <h1>Index</h1>
      <Link to="vehicles">Vehicles</Link>
    </div>
  )
})

export default Index
