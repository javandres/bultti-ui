import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { OperatingUnit } from '../schema-types'

const ExecutionRequirementsView = styled.div``

export type PropTypes = {
  operatingUnits: OperatingUnit[] | null
}

const ExecutionRequirements: React.FC<PropTypes> = observer(({ operatingUnits }) => {
  return (
    <ExecutionRequirementsView>
      <></>
    </ExecutionRequirementsView>
  )
})

export default ExecutionRequirements
