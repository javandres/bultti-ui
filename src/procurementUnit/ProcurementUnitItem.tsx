import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  InspectionValidationError,
  OperatingAreaName,
  ProcurementUnit as ProcurementUnitType,
  ValidationErrorData,
} from '../schema-types'
import { round } from '../util/round'
import ExpandableSection, {
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { text } from '../util/translate'
import ProcurementUnitItemContent from './ProcurementUnitItemContent'

const ProcurementUnitView = styled.div<{ error?: boolean }>`
  position: relative;
`

export type PropTypes = {
  procurementUnit: ProcurementUnitType
  expanded?: boolean
  startDate: string
  catalogueEditable: boolean
  requirementsEditable: boolean
  showExecutionRequirements: boolean
  className?: string
  onUpdate?: () => unknown
  validationErrors: ValidationErrorData[]
}

const operatingAreaNameLocalizationObj = {
  [OperatingAreaName.Center]: text('procurement_unit.operating_area_name.center'),
  [OperatingAreaName.Other]: text('procurement_unit.operating_area_name.other'),
  [OperatingAreaName.Unknown]: text('unknown'),
}

const ProcurementUnitItem: React.FC<PropTypes> = observer(
  ({
    catalogueEditable,
    requirementsEditable,
    showExecutionRequirements,
    startDate,
    procurementUnit,
    expanded = true,
    className,
    onUpdate,
    validationErrors = [],
  }) => {
    const { currentContracts = [], routes = [] } = procurementUnit || {}

    let requirementsInvalid = validationErrors.some(
      (err) => err.type === InspectionValidationError.MissingExecutionRequirements
    )

    let catalogueInvalid = validationErrors.some(
      (err) => err.type === InspectionValidationError.MissingEquipmentCatalogues
    )

    let contractInvalid = validationErrors.some((err) =>
      [
        InspectionValidationError.ContractOutsideInspectionTime,
        InspectionValidationError.MissingContracts,
      ].includes(err.type)
    )

    const procurementUnitAreaName = procurementUnit?.area?.name
      ? procurementUnit?.area?.name
      : OperatingAreaName.Unknown

    return (
      <ProcurementUnitView className={className}>
        {procurementUnit && (
          <ExpandableSection
            unmountOnClose={true}
            error={validationErrors.length !== 0}
            isExpanded={expanded}
            headerContent={
              <>
                <HeaderSection>
                  <HeaderHeading>Kohdetunnus</HeaderHeading>
                  {procurementUnit.procurementUnitId}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Reitit</HeaderHeading>
                  {(routes || [])
                    .map((route) => route?.routeId)
                    .filter((routeId) => !!routeId)
                    .join(', ')}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Kilometrejä viikossa</HeaderHeading>
                  {round((procurementUnit?.weeklyMeters || 0) / 1000)} km
                </HeaderSection>
                <HeaderSection style={{ flexGrow: 2 }}>
                  <HeaderHeading>Voimassaoloaika</HeaderHeading>
                  <DateRangeDisplay
                    startDate={procurementUnit.startDate}
                    endDate={procurementUnit.endDate}
                  />
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>Seuranta-alue</HeaderHeading>
                  {operatingAreaNameLocalizationObj[procurementUnitAreaName]}
                </HeaderSection>
                <HeaderSection style={{ flexGrow: 2 }} error={contractInvalid}>
                  <HeaderHeading>Sopimus</HeaderHeading>
                  {(currentContracts || []).length !== 0 ? (
                    <DateRangeDisplay
                      startDate={currentContracts![0].startDate}
                      endDate={currentContracts![currentContracts!.length - 1].endDate}
                    />
                  ) : (
                    'Ei voimassaolevaa sopimusta.'
                  )}
                </HeaderSection>
              </>
            }>
            {(itemIsExpanded: boolean) => (
              <ProcurementUnitItemContent
                onUpdate={onUpdate}
                isVisible={itemIsExpanded}
                showExecutionRequirements={showExecutionRequirements}
                startDate={startDate}
                procurementUnitId={procurementUnit.id}
                requirementsEditable={requirementsEditable}
                catalogueEditable={catalogueEditable}
                catalogueInvalid={catalogueInvalid}
                requirementsInvalid={requirementsInvalid}
              />
            )}
          </ExpandableSection>
        )}
      </ProcurementUnitView>
    )
  }
)

export default ProcurementUnitItem
