import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ProcurementUnitItem from './ProcurementUnitItem'
import { TextButton } from '../common/components/Button'
import { FlexRow, FormMessage } from '../common/components/common'
import { useQueryData } from '../utils/useQueryData'
import { procurementUnitsQuery } from './procurementUnitsQuery'
import { PageLoading } from '../common/components/Loading'

const ProcurementUnitsView = styled.div``

export type PropTypes = {
  operatorId: number
  productionDate: string
}

const ProcurementUnits: React.FC<PropTypes> = observer(({ operatorId, productionDate }) => {
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

  const procurementUnits = procurementUnitsData || []

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
})

export default ProcurementUnits
