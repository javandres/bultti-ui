import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { FormMessage } from '../common/components/common'
import { get, groupBy } from 'lodash'
import ExecutionArea from './ExecutionArea'
import { OperatingAreaName, ProcurementUnit } from '../schema-types'

const ExecutionRequirementsView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes = {
  procurementUnits: ProcurementUnit[] | null
  operatorId: number
  productionDate: string
}

const ExecutionRequirements: React.FC<PropTypes> = observer(
  ({ productionDate, procurementUnits = [] }) => {
    const areaUnits = groupBy(procurementUnits, 'operatingArea.name')

    return (
      <ExecutionRequirementsView>
        {procurementUnits?.length === 0 && (
          <FormMessage>
            Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
          </FormMessage>
        )}
        {get(areaUnits, OperatingAreaName.Center, []).length !== 0 && (
          <>
            <AreaHeading>Keskusta</AreaHeading>
            <ExecutionArea
              productionDate={productionDate}
              procurementUnits={areaUnits[OperatingAreaName.Center]}
              area={OperatingAreaName.Center}
            />
          </>
        )}
        {get(areaUnits, OperatingAreaName.Other, []).length !== 0 && (
          <>
            <AreaHeading>Muu</AreaHeading>
            <ExecutionArea
              productionDate={productionDate}
              procurementUnits={areaUnits[OperatingAreaName.Other]}
              area={OperatingAreaName.Center}
            />
          </>
        )}
      </ExecutionRequirementsView>
    )
  }
)

export default ExecutionRequirements
