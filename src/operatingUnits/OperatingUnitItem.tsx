import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  Equipment,
  EquipmentCatalogue as EquipmentCatalogueType,
  OperatingUnit as OperatingUnitType,
} from '../schema-types'
import { ArrowDown } from '../common/icons/ArrowDown'
import { round } from '../utils/round'
import EquipmentCatalogue from './EquipmentCatalogue'
import { useCollectionState } from '../utils/useCollectionState'
import { isBetween } from '../utils/isBetween'

const OperatingUnitView = styled.div`
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

const OperatingUnitHeading = styled.h4`
  margin: 0;
  padding: 0.5rem 0.75rem;
  flex: 1 1 50%;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
`

export type PropTypes = {
  operatingUnit: OperatingUnitType
  expanded?: boolean
  productionDate: string
}

const OperatingUnitItem: React.FC<PropTypes> = observer(
  ({ productionDate, operatingUnit, expanded = true }) => {
    // Find the currently active Equipment Catalogue for the Operating Unit
    const activeCatalogue: EquipmentCatalogueType | undefined = (
      operatingUnit?.equipmentCatalogues || []
    ).find((cat) => isBetween(productionDate, cat.startDate, cat.endDate))

    const [
      equipment,
      { add: addEquipment, remove: removeEquipment, update: updateEquipment },
    ] = useCollectionState<Equipment>(activeCatalogue?.equipment || [])

    const [isExpanded, setIsExpanded] = useState(true)
    const { routes = [] } = operatingUnit

    useEffect(() => {
      setIsExpanded(expanded)
    }, [expanded])

    return (
      <OperatingUnitView>
        <HeaderRow expanded={isExpanded}>
          <OperatingUnitHeading>{operatingUnit.operatingUnitId}</OperatingUnitHeading>
          <HeaderSection>
            <SectionHeading>Reitit</SectionHeading>
            {(routes || [])
              .map((route) => route?.routeId)
              .filter((routeId) => !!routeId)
              .join(', ')}
          </HeaderSection>
          <HeaderSection>
            <SectionHeading>Kilometrejä viikossa</SectionHeading>
            {round((operatingUnit?.weeklyExecutionMeters || 0) / 1000)}
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
      </OperatingUnitView>
    )
  }
)

export default OperatingUnitItem
