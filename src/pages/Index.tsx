import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from '@reach/router'
import AppFrame from '../components/AppFrame'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <AppFrame>
      <h1>Bultti</h1>
      <ul>
        <li>
          <Link to="preinspection">Ennakkotarkastus</Link>
        </li>
        <li>
          <Link to="postinspection">Jälkitarkastus</Link>
        </li>
      </ul>
    </AppFrame>
  )
})

export default Index
