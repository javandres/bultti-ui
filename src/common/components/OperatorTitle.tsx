import React from 'react'
import { observer } from 'mobx-react-lite'
import { Text } from '../../util/translate'
import { useStateValue } from '../../state/useAppState'
import { Subtitle } from './Typography'

export type PropTypes = {}

const OperatorTitle: React.FC<PropTypes> = observer(() => {
  const [globalOperator] = useStateValue('globalOperator')

  return (
    <Subtitle>
      {globalOperator ? globalOperator.name : <Text>domain.all.operators</Text>}
    </Subtitle>
  )
})

export default OperatorTitle
