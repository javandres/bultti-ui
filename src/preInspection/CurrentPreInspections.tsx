import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Heading } from '../common/components/common'
import { findValidItems } from '../util/findValid'
import InspectionItem from '../common/components/InspectionItem'
import { Operator } from '../schema-types'
import { Inspection } from '../type/inspection'

const CurrentPreInspectionsView = styled.div``

type PropTypes = {
  operator: null | Operator
  preInspections: Inspection[]
}

const CurrentPreInspections: React.FC<PropTypes> = observer(({ operator, preInspections }) => {
  const currentPreinspections = operator
    ? findValidItems(preInspections, 'productionStart', 'productionEnd')
    : preInspections

  return (
    <CurrentPreInspectionsView>
      <Heading>
        {operator ? 'Voimassa-oleva ennakkotarkastus' : 'Voimassa-olevat ennakkotarkastukset'}
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
