import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import SelectOperator from '../input/SelectOperator'
import styled from 'styled-components'
import { UserRole } from '../../schema-types'

const OperatorSelect = styled(SelectOperator)`
  > label {
    margin-left: 1rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #bbb;
  }

  > div {
    padding: 0 1rem 1rem;
  }

  ul {
    left: 1rem;
    width: calc(100% - 2rem);
  }
`

const GlobalOperatorFilter: React.FC = observer(() => {
  var [operator, setOperatorFilter] = useStateValue('globalOperator')

  var [user] = useStateValue('user')
  var userIsOperator = user && user?.role === UserRole.OperatorUser

  return (
    <OperatorSelect
      allowAll={false}
      onSelect={setOperatorFilter}
      value={operator}
      label={userIsOperator ? 'Liikennöitsijä' : 'Valitse liikennöitsijä'}
      theme="dark"
    />
  )
})

export default GlobalOperatorFilter
