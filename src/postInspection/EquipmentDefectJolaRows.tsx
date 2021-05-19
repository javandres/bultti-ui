import React from 'react'
import { observer } from 'mobx-react-lite'
import { EquipmentDefect, PostInspection } from '../schema-types'
import { gql } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import Table from '../common/table/Table'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'

export type PropTypes = {
  inspection: PostInspection
}

const equipmentDefectPreviewQuery = gql`
  query equipmentDefectPreview($inspectionId: String!) {
    equipmentDefectObservations(inspectionId: $inspectionId) {
      id
      jolaId
      concludedDate
      deadlineDate
      description
      link
      name
      observationDate
      operator
      priority
      procurementUnitId
      registryNumber
      status
    }
  }
`

const EquipmentDefectJolaRows: React.FC<PropTypes> = observer(({ inspection }) => {
  let { data } = useQueryData<EquipmentDefect[]>(equipmentDefectPreviewQuery, {
    variables: {
      inspectionId: inspection.id,
    },
  })

  console.log(data)

  return (
    <ExpandableSection
      isExpanded={true}
      unmountOnClose={true}
      headerContent={<HeaderMainHeading>JOLA rows</HeaderMainHeading>}>
      <Table items={data || []} />
    </ExpandableSection>
  )
})

export default EquipmentDefectJolaRows
