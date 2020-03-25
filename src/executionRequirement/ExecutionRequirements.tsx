import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { MessageView } from '../common/components/common'
import { get, groupBy } from 'lodash'
import { OperatingAreaName } from '../schema-types'

const ExecutionRequirementsView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes = {
  operatorId: number
  startDate: string
}

const ExecutionRequirements: React.FC<PropTypes> = observer(({ startDate }) => {
  const procurementUnits = []
  const areaUnits = groupBy(procurementUnits, 'operatingArea.name')

  return (
    <ExecutionRequirementsView>
      {procurementUnits?.length === 0 && (
        <MessageView>
          Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
        </MessageView>
      )}
      {get(areaUnits, OperatingAreaName.Center, []).length !== 0 && (
        <>
          <AreaHeading>Keskusta</AreaHeading>
        </>
      )}
      {get(areaUnits, OperatingAreaName.Other, []).length !== 0 && (
        <>
          <AreaHeading>Muu</AreaHeading>
        </>
      )}
    </ExecutionRequirementsView>
  )
})

export default ExecutionRequirements
