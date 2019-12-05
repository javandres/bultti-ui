import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Text } from '../utils/translate'
import { Heading } from './common'
import preinspections from '../data/preinspections.json'
import { findValidItems } from '../utils/findValid'
import InspectionItem from './InspectionItem'

const CurrentPreInspectionsView = styled.div``

const OperatorTitle = styled.h3``

const CurrentPreInspections = observer(() => {
  const [globalOperator] = useStateValue('globalOperator')
  const data = !!preinspections && Array.isArray(preinspections) ? preinspections : []
  const currentPreinspections = globalOperator
    ? findValidItems(
        data.filter((inspection) => inspection.operatorId === globalOperator.id),
        'productionDate',
        'endDate'
      )
    : data

  return (
    <CurrentPreInspectionsView>
      <OperatorTitle>
        {globalOperator ? globalOperator.name : <Text>domain.all.operators</Text>}
      </OperatorTitle>
      <Heading>
        {globalOperator
          ? 'Voimassaoleva ennakkotarkastus'
          : 'Voimassaolevat ennakkotarkastukset'}
      </Heading>
      <div>
        {currentPreinspections.map((inspection) => (
          <InspectionItem key={inspection.id} inspection={inspection} />
        ))}
      </div>
    </CurrentPreInspectionsView>
  )
})

export default CurrentPreInspections
