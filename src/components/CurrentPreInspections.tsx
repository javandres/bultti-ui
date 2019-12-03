import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Text } from '../utils/translate'

const CurrentPreInspectionsView = styled.div``

const OperatorTitle = styled.h3``

export type CurrentPreInspectionsProps = {
  children?: React.ReactNode
}

const CurrentPreInspections = observer(({ children }: CurrentPreInspectionsProps) => {
  const [globalOperator] = useStateValue('globalOperator')

  return (
    <CurrentPreInspectionsView>
      <OperatorTitle>
        {globalOperator ? globalOperator.name : <Text>domain.all.operators</Text>}
      </OperatorTitle>
    </CurrentPreInspectionsView>
  )
})

export default CurrentPreInspections
