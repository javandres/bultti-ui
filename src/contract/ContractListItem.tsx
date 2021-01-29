import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import { getReadableDateRange } from '../util/formatDate'

const ContractTitle = styled.h3`
  margin: 0;
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
            {contractData?.description && (
              <HeaderSection>{contractData?.description}</HeaderSection>
            )}
            <HeaderSection>
              {getReadableDateRange({
                start: contractData?.startDate,
                end: contractData?.endDate,
              })}
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
