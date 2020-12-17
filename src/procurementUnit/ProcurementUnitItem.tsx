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
import ProcurementUnitItemContent from './ProcurementUnitItemContent'
import { text, Text } from '../util/translate'

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
                  <HeaderHeading>
                    <Text>procurement_unit.unit_id</Text>
                  </HeaderHeading>
                  {procurementUnit.procurementUnitId}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>procurement_unit.routes</Text>
                  </HeaderHeading>
                  {(routes || [])
                    .map((route) => route?.routeId)
                    .filter((routeId) => !!routeId)
                    .join(', ')}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>procurement_unit.kilometers</Text>
                  </HeaderHeading>
                  {round((procurementUnit?.weeklyMeters || 0) / 1000)} km
                </HeaderSection>
                <HeaderSection style={{ flexGrow: 2 }}>
                  <HeaderHeading>
                    <Text>procurement_unit.valid_time</Text>
                  </HeaderHeading>
                  <DateRangeDisplay
                    startDate={procurementUnit.startDate}
                    endDate={procurementUnit.endDate}
                  />
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>procurement_unit.operation_area</Text>
                  </HeaderHeading>
                  {operatingAreaNameLocalizationObj[procurementUnitAreaName]}
                </HeaderSection>
                <HeaderSection style={{ flexGrow: 2 }} error={contractInvalid}>
                  <HeaderHeading>
                    <Text>procurement_unit.contract</Text>
                  </HeaderHeading>
                  {(currentContracts || []).length !== 0 ? (
                    <DateRangeDisplay
                      startDate={currentContracts![0].startDate}
                      endDate={currentContracts![currentContracts!.length - 1].endDate}
                    />
                  ) : (
                    text('contract.no_valid_contracts')
                  )}
                </HeaderSection>
              </>
            }>
            {(itemIsExpanded: boolean) => (
              <ProcurementUnitItemContent
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
