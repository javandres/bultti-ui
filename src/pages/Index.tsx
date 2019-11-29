import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from '@reach/router'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const Index: React.FC<PropTypes> = observer(() => {
  return (
    <div>
      <h1>Bultti</h1>
      <ul>
        <li>
          <Link to="preinspection">Ennakkotarkastus</Link>
        </li>
        <li>
          <Link to="postinspection">Jälkitarkastus</Link>
        </li>
      </ul>
    </div>
  )
})

export default Index
