import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Button } from '../common/components/Button'
import { gql } from '@apollo/client'
import { useMutationData } from '../util/useMutationData'
import { Inspection } from '../schema-types'

const InspectionDevToolsView = styled.div`
  display: flex;
`

export type PropTypes = {
  inspection: Inspection
  onUpdate: () => unknown
}

let generateEquipmentQuery = gql`
  mutation generateEquipmentMutation($inspectionId: String!) {
    generateEquipmentForPreInspection(inspectionId: $inspectionId)
  }
`

const InspectionDevTools: React.FC<PropTypes> = observer(({ inspection, onUpdate }) => {
  let [generateEquipment] = useMutationData(generateEquipmentQuery, {
    variables: {
      inspectionId: inspection.id,
    },
    onCompleted: () => onUpdate(),
  })

  return (
    <InspectionDevToolsView>
      <Button
        onClick={() => {
          if (
            confirm(
              'Tämä poistaa kaikki tähän tarkastukseen kuuluvia kalustoluetteloiden ajoneuvoja ja generoi testidataa tilalle. Haluatko varmasti jatkaa?'
            )
          ) {
            generateEquipment()
          }
        }}>
        Generate equipment and catalogues (do not click more than once)
      </Button>
    </InspectionDevToolsView>
  )
})

export default InspectionDevTools
