import React from 'react'
import styled from 'styled-components'
import { Inspection } from '../types/inspection'
import { orderBy } from 'lodash'
import { Heading } from './common'
import InspectionItem from './InspectionItem'

const AllPreInspectionsView = styled.div``

export type PropTypes = {
  preInspections: Inspection[]
}
const AllPreInspections: React.FC<PropTypes> = ({ preInspections }) => {
  const orderedPreinspections = orderBy(preInspections, 'productionStart', 'desc')

  return (
    <AllPreInspectionsView>
      <Heading>Vanhat ennakkotarkastukset</Heading>
      <div>
        {orderedPreinspections.map((inspection) => (
          <InspectionItem key={inspection.id} inspection={inspection} />
        ))}
      </div>
    </AllPreInspectionsView>
  )
}

export default AllPreInspections
