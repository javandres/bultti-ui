import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { OperatingArea, OperatingUnit } from '../schema-types'
import { FormMessage } from '../common/components/common'
import { get, groupBy } from 'lodash'
import ExecutionArea from './ExecutionArea'

const ExecutionRequirementsView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 0.5rem;
`

export type PropTypes = {
  operatingUnits: OperatingUnit[] | null
}

const ExecutionRequirements: React.FC<PropTypes> = observer(({ operatingUnits = [] }) => {
  const areaUnits = groupBy(operatingUnits, 'operatingArea')

  return (
    <ExecutionRequirementsView>
      {operatingUnits?.length === 0 && (
        <FormMessage>
          Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
        </FormMessage>
      )}
      {get(areaUnits, OperatingArea.Center, []).length !== 0 && (
        <>
          <AreaHeading>Keskusta</AreaHeading>
          <ExecutionArea
            operatingUnits={areaUnits[OperatingArea.Center]}
            area={OperatingArea.Center}
          />
        </>
      )}
      {get(areaUnits, OperatingArea.Other, []).length !== 0 && (
        <>
          <AreaHeading>Muu</AreaHeading>
          <ExecutionArea
            operatingUnits={areaUnits[OperatingArea.Other]}
            area={OperatingArea.Center}
          />
        </>
      )}
    </ExecutionRequirementsView>
  )
})

export default ExecutionRequirements
