import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ProcurementUnitItem from './ProcurementUnitItem'
import { ProcurementUnit as ProcurementUnitType } from '../schema-types'
import { TextButton } from '../common/components/Button'
import { FlexRow, FormMessage } from '../common/components/common'
import { useQueryData } from '../utils/useQueryData'
import { procurementUnitsQuery } from '../queries/procurementUnitsQuery'
import { PageLoading } from '../common/components/Loading'

const ProcurementUnitsView = styled.div``

export type PropTypes = {
  operatorId: number
  productionDate: string
  procurementUnits: ProcurementUnitType[] | null
  onUpdate?: (item: ProcurementUnitType, key: string, value: any) => void
  initialize: (procurementUnits: ProcurementUnitType[]) => void
}

const ProcurementUnits: React.FC<PropTypes> = observer(
  ({ procurementUnits = [], operatorId, productionDate, onUpdate, initialize }) => {
    const [procurementUnitsExpanded, setProcurementUnitsExpanded] = useState(true)

    const toggleProcurementUnitsExpanded = useCallback(() => {
      setProcurementUnitsExpanded((currentVal) => !currentVal)
    }, [])

    // Get the operating units for the selected operator.
    const { data: procurementUnitsData, loading: procurementUnitsLoading } = useQueryData(
      procurementUnitsQuery,
      {
        variables: {
          operatorId: operatorId,
          startDate: productionDate,
        },
      }
    )

    const procurementUnitsResults = procurementUnitsData || []

    useEffect(() => {
      if (
        procurementUnits &&
        procurementUnits.length === 0 &&
        !procurementUnitsLoading &&
        procurementUnitsResults.length !== 0
      ) {
        initialize(procurementUnitsResults)
      }
    }, [procurementUnits, procurementUnitsResults, procurementUnitsLoading])

    return (
      <ProcurementUnitsView>
        {procurementUnitsLoading ? (
          <PageLoading />
        ) : !procurementUnits || procurementUnits?.length === 0 ? (
          <FormMessage>
            Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
          </FormMessage>
        ) : (
          <>
            <FlexRow>
              {procurementUnits.length !== 0 && (
                <TextButton onClick={toggleProcurementUnitsExpanded}>
                  {procurementUnitsExpanded
                    ? 'Piilota kaikki kilpailukohteet'
                    : 'Näytä kaikki kilpailukohteet'}
                </TextButton>
              )}
            </FlexRow>
            {procurementUnits.map((procurementUnit) => (
              <ProcurementUnitItem
                key={procurementUnit.id}
                productionDate={productionDate}
                procurementUnit={procurementUnit}
                expanded={procurementUnitsExpanded}
              />
            ))}
          </>
        )}
      </ProcurementUnitsView>
    )
  }
)

export default ProcurementUnits
