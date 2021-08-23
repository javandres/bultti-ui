import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import {
  Contract,
  InspectionValidationError,
  OperatingAreaName,
  ProcurementUnit as ProcurementUnitType,
  ValidationErrorData,
} from '../schema-types'
import ExpandableSection, {
  HeaderHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import ProcurementUnitItemContent from './ProcurementUnitItemContent'
import { text, Text } from '../util/translate'
import { getDateObject } from '../util/formatDate'
import { isWithinInterval } from 'date-fns'

const ProcurementUnitView = styled.div<{ error?: boolean }>`
  position: relative;
`

const ContractDescription = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

export type PropTypes = {
  procurementUnit: ProcurementUnitType
  expanded?: boolean
  startDate: string
  endDate: string
  isCatalogueEditable: boolean
  requirementsEditable: boolean
  showExecutionRequirements: boolean
  className?: string
  validationErrors: ValidationErrorData[]
  contractSelectionDate: Date
  isOnlyActiveCatalogueVisible: boolean
  testId?: string
}

const operatingAreaNameLocalizationObj = {
  [OperatingAreaName.Center]: text('center'),
  [OperatingAreaName.Other]: text('other'),
  [OperatingAreaName.Unknown]: text('unknown'),
}

const ProcurementUnitItem: React.FC<PropTypes> = observer(
  ({
    isCatalogueEditable,
    requirementsEditable,
    showExecutionRequirements,
    startDate,
    endDate,
    procurementUnit,
    expanded = true,
    className,
    validationErrors = [],
    contractSelectionDate,
    isOnlyActiveCatalogueVisible,
    testId,
  }) => {
    const { contract, routes = [] } = procurementUnit || {}

    let requirementsInvalid = validationErrors.some(
      (err) => err.type === InspectionValidationError.MissingExecutionRequirements
    )

    let catalogueInvalid = validationErrors.some(
      (err) => err.type === InspectionValidationError.MissingEquipmentCatalogues
    )

    let contractInvalid = validationErrors.some((err) =>
      [
        InspectionValidationError.InvalidContracts,
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
            testId={`${testId}_section`}
            unmountOnClose={true}
            error={validationErrors.length !== 0}
            isExpanded={expanded}
            headerContent={
              <>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>procurementUnit_unitId</Text>
                  </HeaderHeading>
                  {procurementUnit.procurementUnitId}
                  <HeaderHeading>
                    <Text>procurementUnit_operationArea</Text>
                  </HeaderHeading>
                  {operatingAreaNameLocalizationObj[procurementUnitAreaName]}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>routes</Text>
                  </HeaderHeading>
                  {(routes || [])
                    .map((route) => route?.routeId)
                    .filter((routeId) => !!routeId)
                    .join(', ')}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>procurementUnit_unitValidTime</Text>
                  </HeaderHeading>
                  <DateRangeDisplay
                    startDate={procurementUnit.startDate}
                    endDate={procurementUnit.endDate}
                  />
                  {procurementUnit.optionPeriodStart && (
                    <>
                      <HeaderHeading>
                        <Text>procurementUnit_optionPeriodStart</Text>
                      </HeaderHeading>
                      {procurementUnit.optionPeriodStart}
                    </>
                  )}
                </HeaderSection>
                <HeaderSection>
                  <HeaderHeading>
                    <Text>procurementUnit_ageRequirement</Text>
                  </HeaderHeading>
                  {procurementUnit?.maximumAverageAge || 0}{' '}
                  <Text>procurementUnit_ageRequirementYears</Text>
                  {procurementUnit?.maximumAverageAgeWithOptions !==
                    procurementUnit?.maximumAverageAge && (
                    <>
                      <HeaderHeading>
                        <Text>procurementUnit_ageRequirementWithOptions</Text>
                      </HeaderHeading>
                      {procurementUnit?.maximumAverageAgeWithOptions}{' '}
                      <Text>procurementUnit_ageRequirementYears</Text>
                    </>
                  )}
                </HeaderSection>
                <HeaderSection style={{ flexGrow: 2 }} error={contractInvalid}>
                  <HeaderHeading>
                    <Text>contract</Text>
                  </HeaderHeading>
                  {contract ? (
                    <ContractDescription>{contract.description}</ContractDescription>
                  ) : (
                    text('procurementUnit_noValidContracts')
                  )}
                </HeaderSection>
              </>
            }>
            {(itemIsExpanded: boolean) => (
              <ProcurementUnitItemContent
                testId={testId}
                isVisible={itemIsExpanded}
                showExecutionRequirements={showExecutionRequirements}
                startDate={startDate}
                endDate={endDate}
                procurementUnitId={procurementUnit.id}
                requirementsEditable={requirementsEditable}
                isCatalogueEditable={isCatalogueEditable}
                catalogueInvalid={catalogueInvalid}
                requirementsInvalid={requirementsInvalid}
                isOnlyActiveCatalogueVisible={isOnlyActiveCatalogueVisible}
              />
            )}
          </ExpandableSection>
        )}
      </ProcurementUnitView>
    )
  }
)

export default ProcurementUnitItem
