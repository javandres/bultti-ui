import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ProcurementUnitItem from './ProcurementUnitItem'
import { TextButton } from '../common/components/Button'
import { FlexRow, TransparentPageSection } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitsQuery } from './procurementUnitsQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { MessageView } from '../common/components/Messages'

const ProcurementUnitsView = styled(TransparentPageSection)``

export type PropTypes = {
  operatorId?: number
  startDate?: string
}

const ProcurementUnits: React.FC<PropTypes> = observer((props = {}) => {
  const inspection = useContext(PreInspectionContext)
  let { operatorId, startDate } = inspection || props

  let catalogueEditable = !inspection
  let showExecutionRequirements = !!inspection

  const [procurementUnitsExpanded, setProcurementUnitsExpanded] = useState(false)

  const toggleProcurementUnitsExpanded = useCallback(() => {
    setProcurementUnitsExpanded((currentVal) => !currentVal)
  }, [])

  // Get the operating units for the selected operator.
  const { data: procurementUnitsData, loading: procurementUnitsLoading } = useQueryData(
    procurementUnitsQuery,
    {
      skip: !operatorId || !startDate,
      variables: {
        operatorId: operatorId,
        startDate: startDate,
      },
    }
  )

  const procurementUnits = procurementUnitsData || []

  return (
    <ProcurementUnitsView>
      <LoadingDisplay loading={procurementUnitsLoading} />
      {!procurementUnitsLoading && (!procurementUnits || procurementUnits?.length === 0) ? (
        <MessageView>
          Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
        </MessageView>
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
              catalogueEditable={catalogueEditable}
              showExecutionRequirements={showExecutionRequirements}
              key={procurementUnit.id}
              startDate={startDate}
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
