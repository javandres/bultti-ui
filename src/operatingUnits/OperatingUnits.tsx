import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import OperatingUnitItem from './OperatingUnitItem'
import { OperatingUnit as OperatingUnitType } from '../schema-types'
import { TextButton } from '../common/components/Button'
import { FlexRow, FormMessage } from '../common/components/common'

const OperatingUnitsView = styled.div``

export type PropTypes = {
  operatorId: string
  productionDate: string
  operatingUnits: OperatingUnitType[] | null
  onUpdate?: (operatingUnits: OperatingUnitType[]) => void
}

const OperatingUnits: React.FC<PropTypes> = observer(
  ({ operatingUnits = [], operatorId, productionDate, onUpdate }) => {
    const [operatingUnitsExpanded, setOperatingUnitsExpanded] = useState(true)

    const toggleOperatingUnitsExpanded = useCallback(() => {
      setOperatingUnitsExpanded((currentVal) => !currentVal)
    }, [])

    return (
      <OperatingUnitsView>
        {!operatingUnits || operatingUnits?.length === 0 ? (
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
