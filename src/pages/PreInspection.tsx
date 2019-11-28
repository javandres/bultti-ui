import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link, RouteComponentProps } from '@reach/router'

type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const PreInspection: React.FC<PropTypes> = observer((props) => {
  return (
    <div>
      <Link to="/">Home</Link>
      <h3>Ennakkotarkastus</h3>
      <ul>
        <li>
          <Link to="/preinspection">Ennakkotarkastuksen tekeminen</Link>
        </li>
        <li>
          <Link to="/preinspection/reports">Raportit</Link>
        </li>
      </ul>
      <h1>Tehdyt ennakkotarkastukset</h1>
      <p>Tehdyt ennakkotarkastukset...</p>
    </div>
  )
})

export default PreInspection
