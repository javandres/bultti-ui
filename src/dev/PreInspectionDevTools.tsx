import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button } from '../common/components/Button'
import gql from 'graphql-tag'
import { ENV } from '../constants'
import { useMutationData } from '../util/useMutationData'
import { PreInspection } from '../schema-types'

const PreInspectionDevToolsView = styled.div`
  display: flex;
`

export type PropTypes = {
  preInspection: PreInspection
}

let generateEquipmentQuery = gql`
  mutation generateEquipmentMutation($preInspectionId: String!) {
    generateEquipmentForPreInspection(preInspectionId: $preInspectionId)
  }
`

const PreInspectionDevTools: React.FC<PropTypes> = observer(({ preInspection }) => {
  let [generateEquipment] = useMutationData(generateEquipmentQuery, {
    variables: {
      preInspectionId: preInspection.id,
    },
  })

  if (ENV !== 'development') {
    return null
  }

  return (
    <PreInspectionDevToolsView>
      <Button onClick={() => generateEquipment()}>Generate equipment and catalogues</Button>
    </PreInspectionDevToolsView>
  )
})

export default PreInspectionDevTools
