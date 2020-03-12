import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  Equipment,
  EquipmentCatalogue as EquipmentCatalogueType,
  ProcurementUnit as ProcurementUnitType,
} from '../schema-types'
import { ArrowDown } from '../common/icons/ArrowDown'
import { round } from '../utils/round'
import EquipmentCatalogue from './EquipmentCatalogue'
import { useCollectionState } from '../utils/useCollectionState'
import { isBetween } from '../utils/isBetween'
import { useQueryData } from '../utils/useQueryData'
import { procurementUnitQuery } from './procurementUnitsQuery'

const ProcurementUnitView = styled.div`
  border: 1px solid var(--lighter-grey);
  margin-top: 1rem;
  border-radius: 0.5rem;
  background: white;
`

const HeaderRow = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  border-bottom: ${(p) => (p.expanded ? '1px solid var(--lighter-grey)' : '0')};

  > *:nth-child(even) {
    background-color: #fcfcfc;
  }
`

const HeaderSection = styled.div`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);
  flex: 1 1 50%;

  &:last-child {
    border-right: 0;
  }
`

const ExpandToggle = styled.button<{ expanded?: boolean }>`
  background: transparent;
  cursor: pointer;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  outline: none;
  display: flex;
  align-items: center;

  > * {
    transition: transform 0.1s ease-out;
    transform: rotate(${(p) => (!p.expanded ? '180deg' : '0deg')});
  }
`

const SectionHeading = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const Content = styled.div`
  padding: 1rem;
`

const ProcurementUnitHeading = styled.h4`
  margin: 0;
  padding: 0.5rem 0.75rem;
  flex: 1 1 50%;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
`

export type PropTypes = {
  procurementUnit: ProcurementUnitType
  expanded?: boolean
  productionDate: string
}

type EquipmentWithQuota = Equipment & { percentageQuota: number }

const ProcurementUnitItem: React.FC<PropTypes> = observer(
  ({ productionDate, procurementUnit: { id }, expanded = true }) => {
    // Get the operating units for the selected operator.
    const { data: procurementUnit } = useQueryData(procurementUnitQuery, {
      variables: {
        procurementUnitId: id,
      },
    })

    // Find the currently active Equipment Catalogue for the Operating Unit
    const activeCatalogue: EquipmentCatalogueType | undefined = useMemo(
      () =>
        (procurementUnit?.equipmentCatalogues || []).find((cat) =>
          isBetween(productionDate, cat.startDate, cat.endDate)
        ),
      [procurementUnit]
    )

    const catalogueEquipment: EquipmentWithQuota[] = useMemo(
      () =>
        (activeCatalogue?.equipmentQuotas || []).map((quota) => ({
          ...quota.equipment,
          percentageQuota: quota.percentageQuota,
        })),
      [activeCatalogue]
    )

    const [
      equipment,
      { add: addEquipment, remove: removeEquipment, update: updateEquipment },
    ] = useCollectionState<Equipment>(catalogueEquipment)

    const [isExpanded, setIsExpanded] = useState(true)
    const { routes = [] } = procurementUnit

    useEffect(() => {
      setIsExpanded(expanded)
    }, [expanded])

    return (
      <ProcurementUnitView>
        <HeaderRow expanded={isExpanded}>
          <ProcurementUnitHeading>{procurementUnit.procurementUnitId}</ProcurementUnitHeading>
          <HeaderSection>
            <SectionHeading>Reitit</SectionHeading>
            {(routes || [])
              .map((route) => route?.routeId)
              .filter((routeId) => !!routeId)
              .join(', ')}
          </HeaderSection>
          <HeaderSection>
            <SectionHeading>Kilometrejä viikossa</SectionHeading>
            {round((procurementUnit?.weeklyMeters || 0) / 1000)}
          </HeaderSection>
          <HeaderSection>
            <SectionHeading>Maksimi keski-ikä</SectionHeading>8 (7,6)
          </HeaderSection>
          <ExpandToggle
            expanded={isExpanded}
            onClick={() => setIsExpanded((currentVal) => !currentVal)}>
            <ArrowDown width="1rem" height="1rem" fill="var(dark-grey)" />
          </ExpandToggle>
        </HeaderRow>
        {isExpanded && (
          <Content>
            <EquipmentCatalogue
              equipment={equipment}
              addEquipment={addEquipment}
              removeEquipment={removeEquipment}
              updateEquipment={updateEquipment}
            />
          </Content>
        )}
      </ProcurementUnitView>
    )
  }
)

export default ProcurementUnitItem
