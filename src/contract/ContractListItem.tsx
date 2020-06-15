import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT } from '../constants'

const ContractTitle = styled.h3`
  margin: 0;
`

const ContractDescription = styled.p`
  margin: 0 0 1rem;
  padding: 0.75rem;
  background: var(--white-grey);
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  line-height: 1.4;
`

export type PropTypes = {
  children: React.ReactChild
  headerContent?: React.ReactChild
  contractData: Contract
  isExpanded?: boolean
}

const ContractListItem: React.FC<PropTypes> = observer(
  ({ contractData, children: contract, headerContent, isExpanded = false }) => {
    return (
      <ExpandableSection
        isExpanded={isExpanded}
        headerContent={
          <>
            <HeaderSection>
              <ContractTitle>
                {contractData?.operator?.operatorName || 'Uusi sopimus'}
              </ContractTitle>
            </HeaderSection>
            <HeaderSection>
              {format(parseISO(contractData?.startDate), READABLE_DATE_FORMAT)} -{' '}
              {format(parseISO(contractData?.endDate), READABLE_DATE_FORMAT)}
            </HeaderSection>
            {headerContent}
          </>
        }>
        {contract}
      </ExpandableSection>
    )
  }
)

export default ContractListItem
