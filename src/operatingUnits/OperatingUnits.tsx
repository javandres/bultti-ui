import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import OperatingUnitItem from './OperatingUnitItem'
import { OperatingUnit as OperatingUnitType } from '../schema-types'
import { TextButton } from '../common/components/Button'
import { FlexRow, FormMessage } from '../common/components/common'
import { useQueryData } from '../utils/useQueryData'
import { operatingUnitsQuery } from '../queries/operatingUnitsQuery'
import { PageLoading } from '../common/components/Loading'

const OperatingUnitsView = styled.div``

export type PropTypes = {
  operatorId: string
  productionDate: string
  operatingUnits: OperatingUnitType[] | null
  onUpdate?: (item: OperatingUnitType, key: string, value: any) => void
  initialize: (operatingUnits: OperatingUnitType[]) => void
}

const OperatingUnits: React.FC<PropTypes> = observer(
  ({ operatingUnits = [], operatorId, productionDate, onUpdate, initialize }) => {
    const [operatingUnitsExpanded, setOperatingUnitsExpanded] = useState(true)

    const toggleOperatingUnitsExpanded = useCallback(() => {
      setOperatingUnitsExpanded((currentVal) => !currentVal)
    }, [])

    // Get the operating units for the selected operator.
    const { data: operatingUnitsData, loading: operatingUnitsLoading } = useQueryData(
      operatingUnitsQuery,
      {
        variables: {
          operatorId: operatorId,
          startDate: productionDate,
        },
      }
    )

    const operatingUnitsResults = operatingUnitsData || []

    useEffect(() => {
      if (
        operatingUnits &&
        operatingUnits.length === 0 &&
        !operatingUnitsLoading &&
        operatingUnitsResults.length !== 0
      ) {
        initialize(operatingUnitsResults)
      }
    }, [operatingUnits, operatingUnitsResults, operatingUnitsLoading])

    return (
      <OperatingUnitsView>
        {operatingUnitsLoading ? (
          <PageLoading />
        ) : !operatingUnits || operatingUnits?.length === 0 ? (
          <FormMessage>
            Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
          </FormMessage>
        ) : (
          <>
            <FlexRow>
              {operatingUnits.length !== 0 && (
                <TextButton onClick={toggleOperatingUnitsExpanded}>
                  {operatingUnitsExpanded
                    ? 'Piilota kaikki kilpailukohteet'
                    : 'Näytä kaikki kilpailukohteet'}
                </TextButton>
              )}
            </FlexRow>
            {operatingUnits.map((operatingUnit) => (
              <OperatingUnitItem
                key={operatingUnit.id}
                productionDate={productionDate}
                operatingUnit={operatingUnit}
                expanded={operatingUnitsExpanded}
              />
            ))}
          </>
        )}
      </OperatingUnitsView>
    )
  }
)

export default OperatingUnits
