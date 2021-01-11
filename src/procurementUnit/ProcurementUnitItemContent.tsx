import React, { useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  EquipmentCatalogue as EquipmentCatalogueType,
  ProcurementUnit as ProcurementUnitType,
} from '../schema-types'
import { orderBy } from 'lodash'
import EquipmentCatalogue from '../equipmentCatalogue/EquipmentCatalogue'
import { isBetween } from '../util/isBetween'
import { useQueryData } from '../util/useQueryData'
import { procurementUnitQuery } from './procurementUnitsQuery'
import { LoadingDisplay } from '../common/components/Loading'
import { FlexRow } from '../common/components/common'
import { parseISO } from 'date-fns'
import ProcurementUnitExecutionRequirement from '../executionRequirement/ProcurementUnitExecutionRequirement'
import { SubHeading } from '../common/components/Typography'
import { useRefetch } from '../util/useRefetch'
import { MessageView } from '../common/components/Messages'
import EditEquipmentCatalogue from '../equipmentCatalogue/EditEquipmentCatalogue'
import { Text } from '../util/translate'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import DateRangeDisplay from '../common/components/DateRangeDisplay'

const ContentWrapper = styled.div`
  position: relative;
`

const CatalogueWrapper = styled.div<{ isInvalid: boolean }>`
  border-radius: 0.5rem;
  position: relative;
  margin-top: 2rem;

  ${(p) =>
    p.isInvalid
      ? css`
          border: 1px solid #ffacac;
          padding: 1rem;
          margin: 1rem -0.5rem -0.5rem;
          background: rgba(255, 252, 252, 1);
        `
      : ''}
`

type ContentPropTypes = {
  showExecutionRequirements: boolean
  startDate: string
  endDate: string
  procurementUnitId: string
  catalogueEditable: boolean
  requirementsEditable: boolean
  isVisible: boolean
  catalogueInvalid: boolean
  requirementsInvalid: boolean
}

const ProcurementUnitItemContent = observer(
  ({
    showExecutionRequirements,
    startDate,
    endDate,
    procurementUnitId,
    catalogueEditable,
    requirementsEditable,
    isVisible,
    catalogueInvalid,
    requirementsInvalid,
  }: ContentPropTypes) => {
    // Get the operating units for the selected operator.
    const { data: procurementUnit, loading, refetch: refetchUnitData } =
      useQueryData<ProcurementUnitType>(procurementUnitQuery, {
        skip: !procurementUnitId || !isVisible,
        variables: {
          procurementUnitId,
          startDate,
          endDate,
        },
      }) || {}

    let refetch = useRefetch(refetchUnitData)

    let updateUnit = useCallback(() => {
      refetch()
    }, [refetch])

    // Find the currently active Equipment Catalogue for the Operating Unit
    const catalogues: EquipmentCatalogueType[] = useMemo(() => {
      let unitCatalogues = procurementUnit?.equipmentCatalogues || []

      return catalogueEditable
        ? unitCatalogues
        : unitCatalogues.filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
    }, [procurementUnit, catalogueEditable, startDate])

    let hasEquipment = catalogues
      .filter((cat) => isBetween(startDate, cat.startDate, cat.endDate))
      .some((cat) => cat.equipmentQuotas?.length !== 0)

    const inspectionStartDate = useMemo(() => parseISO(startDate), [startDate])

    return (
      <ContentWrapper>
        <LoadingDisplay loading={loading} />
        {procurementUnit && (
          <>
            {showExecutionRequirements && hasEquipment && (
              <ProcurementUnitExecutionRequirement
                isEditable={requirementsEditable}
                procurementUnit={procurementUnit}
                valid={!requirementsInvalid}
              />
            )}
            <FlexRow>
              <SubHeading>
                <Text>procurement_unit.unit_info</Text>
              </SubHeading>
            </FlexRow>
            <CatalogueWrapper isInvalid={catalogueInvalid}>
              <SubHeading>
                <Text>catalogue.catalogues_list_heading</Text>
              </SubHeading>
              {orderBy(catalogues, 'startDate', 'desc').map((catalogue) => {
                return (
                  <ExpandableSection
                    key={catalogue.id}
                    headerContent={
                      <HeaderSection>
                        <DateRangeDisplay
                          startDate={catalogue.startDate}
                          endDate={catalogue.endDate}
                        />
                      </HeaderSection>
                    }>
                    <EquipmentCatalogue
                      startDate={inspectionStartDate}
                      procurementUnit={procurementUnit}
                      catalogue={catalogue}
                      operatorId={procurementUnit.operatorId}
                      onCatalogueChanged={updateUnit}
                      editable={catalogueEditable}
                    />
                  </ExpandableSection>
                )
              })}
              {catalogues.length === 0 && (
                <MessageView>
                  <Text>procurement_unit.no_catalogue</Text>
                </MessageView>
              )}
              <EditEquipmentCatalogue
                onChange={updateUnit}
                procurementUnit={procurementUnit}
              />
            </CatalogueWrapper>
          </>
        )}
      </ContentWrapper>
    )
  }
)

export default ProcurementUnitItemContent
