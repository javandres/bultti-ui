import React from 'react'
import { useAuth } from './utils/useAuth'
import { observer } from 'mobx-react-lite'
import { Router } from '@reach/router'
import Index from './pages/Index'
import Vehicles from './pages/Vehicles'

const App: React.FC = observer(() => {
  useAuth()

  return (
    <Router>
      <Index path="/" />
      <Vehicles path="vehicles" />
    </Router>
  )
})

export default App
