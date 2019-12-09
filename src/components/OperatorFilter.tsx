import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import SelectOperator from './SelectOperator'

const OperatorFilter = observer(() => {
  const [operator, setOperatorFilter] = useStateValue('globalOperator')
  return <SelectOperator onSelectOperator={setOperatorFilter} selectedOperator={operator} />
})

export default OperatorFilter
