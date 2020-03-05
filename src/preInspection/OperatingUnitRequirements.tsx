import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { OperatingUnit } from '../schema-types'

const OperatingUnitView = styled.div`
  border: 1px solid var(--lighter-grey);
  margin-top: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
`

const HeaderRow = styled.div<{ expanded?: boolean }>`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  border-bottom: ${(p) => (p.expanded ? '1px solid var(--lighter-grey)' : '0')};
`

const HeaderSection = styled.div`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);
  flex: 1 1 auto;

  &:last-child {
    border-right: 0;
  }

  &:nth-child(even) {
    background-color: var(--white-grey);
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
  flex: 1 1 auto;
  border-right: 1px solid var(--lighter-grey);
`

export type PropTypes = {
  operatingUnit: OperatingUnit
  expanded?: boolean
}

const OperatingUnitRequirements: React.FC<PropTypes> = observer(
  ({ operatingUnit, expanded = true }) => {
    const { routes = [] } = operatingUnit

    return (
      <OperatingUnitView>
        <HeaderRow expanded={expanded}>
          <OperatingUnitHeading>{operatingUnit.operatingUnitId}</OperatingUnitHeading>
          <HeaderSection>
            <SectionHeading>Routes</SectionHeading>
            {(routes || [])
              .map((route) => route?.routeId)
              .filter((routeId) => !!routeId)
              .join(', ')}
          </HeaderSection>
        </HeaderRow>
        {expanded && <Content>Operating unit content</Content>}
      </OperatingUnitView>
    )
  }
)

export default OperatingUnitRequirements
