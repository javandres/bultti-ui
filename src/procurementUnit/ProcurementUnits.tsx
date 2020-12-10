import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ProcurementUnitItem from './ProcurementUnitItem'
import { Button, ButtonSize, ButtonStyle, TextButton } from '../common/components/Button'
import { FlexRow, TransparentPageSection } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitsQuery } from './procurementUnitsQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { InspectionContext } from '../inspection/InspectionContext'
import { MessageView } from '../common/components/Messages'
import { ValidationErrorData } from '../schema-types'

const ProcurementUnitsView = styled(TransparentPageSection)``

export type PropTypes = {
  operatorId: number
  startDate: string
  endDate: string
  requirementsEditable: boolean
  onUpdate?: () => unknown
  getErrorsById?: (objectId: string) => ValidationErrorData[]
}

const ProcurementUnits: React.FC<PropTypes> = observer(
  ({
    getErrorsById,
    requirementsEditable = true,
    onUpdate,
    operatorId,
    startDate,
    endDate,
  }) => {
    const inspection = useContext(InspectionContext)

    let catalogueEditable = !inspection
    let showExecutionRequirements = !!inspection

    const [procurementUnitsExpanded, setProcurementUnitsExpanded] = useState(false)

    const toggleProcurementUnitsExpanded = useCallback(() => {
      setProcurementUnitsExpanded((currentVal) => !currentVal)
    }, [])

    let getUnitErrors = useCallback((id: string) => (getErrorsById ? getErrorsById(id) : []), [
      getErrorsById,
    ])

    // Get the operating units for the selected operator.
    const {
      data: procurementUnitsData,
      loading: procurementUnitsLoading,
      refetch,
    } = useQueryData(procurementUnitsQuery, {
      skip: !operatorId,
      variables: {
        operatorId: operatorId,
        startDate,
        endDate,
      },
    })

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
              <Button
                loading={procurementUnitsLoading}
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}
                onClick={() => refetch()}>
                Päivitä
              </Button>
            </FlexRow>
            {procurementUnits.map((procurementUnit) => {
              let unitErrors = getUnitErrors(procurementUnit.id)

              return (
                <ProcurementUnitItem
                  validationErrors={unitErrors}
                  onUpdate={onUpdate}
                  requirementsEditable={requirementsEditable}
                  catalogueEditable={catalogueEditable}
                  showExecutionRequirements={showExecutionRequirements}
                  key={procurementUnit.id}
                  startDate={startDate}
                  procurementUnit={procurementUnit}
                  expanded={procurementUnitsExpanded}
                />
              )
            })}
          </>
        )}
      </ProcurementUnitsView>
    )
  }
)

export default ProcurementUnits
