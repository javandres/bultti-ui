import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button } from '../common/components/Button'
import { gql } from '@apollo/client'
import { ENV } from '../constants'
import { useMutationData } from '../util/useMutationData'
import { Inspection } from '../schema-types'

const InspectionDevToolsView = styled.div`
  display: flex;
`

export type PropTypes = {
  inspection: Inspection
}

let generateEquipmentQuery = gql`
  mutation generateEquipmentMutation($inspectionId: String!) {
    generateEquipmentForPreInspection(inspectionId: $inspectionId)
  }
`

const InspectionDevTools: React.FC<PropTypes> = observer(({ inspection }) => {
  let [generateEquipment] = useMutationData(generateEquipmentQuery, {
    variables: {
      inspectionId: inspection.id,
    },
  })

  if (ENV !== 'development') {
    return null
  }

  return (
    <InspectionDevToolsView>
      <Button onClick={() => generateEquipment()}>Generate equipment and catalogues</Button>
    </InspectionDevToolsView>
  )
})

export default InspectionDevTools
