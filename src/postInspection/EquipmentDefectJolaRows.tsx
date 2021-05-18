import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { EquipmentDefect, PostInspection } from '../schema-types'
import { gql } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import Table from '../common/table/Table'

const EquipmentDefectJolaRowsView = styled.div``

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
      updatedDate
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
    <EquipmentDefectJolaRowsView>
      <Table items={data || []} />
    </EquipmentDefectJolaRowsView>
  )
})

export default EquipmentDefectJolaRows
