import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../../state/useAppState'
import SelectOperator from '../input/SelectOperator'
import { Operator, UserRole } from '../../schema-types'
import { getUrlValue } from '../../util/urlValue'
import { useHistory } from 'react-router-dom'

const GlobalOperatorFilter: React.FC = observer(() => {
  var [operator, setOperatorFilter] = useStateValue('globalOperator')
  var [user] = useStateValue('user')
  var history = useHistory()

  let initialOperatorId = useMemo(() => {
    let initialVal = getUrlValue(history, 'operator', undefined)
    return initialVal ? parseInt(initialVal as string, 10) : undefined
  }, [user, history])

  var userIsOperator = user && user?.role === UserRole.Operator

  return (
    <SelectOperator
      onSelect={(operator) => setOperatorFilter(operator as Operator)}
      value={operator}
      label={userIsOperator ? 'Liikennöitsijä' : 'Valitse liikennöitsijä'}
      selectInitialId={initialOperatorId}
    />
  )
})

export default GlobalOperatorFilter
