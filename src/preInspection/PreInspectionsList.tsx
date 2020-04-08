import React, { useCallback } from 'react'
import styled from 'styled-components'
import { orderBy } from 'lodash'
import { Heading } from '../common/components/common'
import PreInspectionItem from './PreInspectionItem'
import { PreInspection } from '../schema-types'

const PreInspectionsListView = styled.div``

const PreInspectionsWrapper = styled.div``

export type PropTypes = {
  preInspections: PreInspection[]
  onUpdate: () => unknown
}
const PreInspectionsList: React.FC<PropTypes> = ({ preInspections, onUpdate }) => {
  const orderedPreinspections = orderBy(preInspections, ['startDate', 'version'], ['desc', 'desc'])

  return (
    <PreInspectionsListView>
      <Heading>Liikennöitsijän ennakkotarkastukset</Heading>
      <PreInspectionsWrapper>
        {orderedPreinspections.map((preInspection) => (
          <PreInspectionItem key={preInspection.id} preInspection={preInspection} />
        ))}
      </PreInspectionsWrapper>
    </PreInspectionsListView>
  )
}

export default PreInspectionsList
