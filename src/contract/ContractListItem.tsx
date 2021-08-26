import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Contract } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'

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
            {contractData?.description && (
              <HeaderSection>{contractData?.description}</HeaderSection>
            )}
            {headerContent}
          </>
        }>
        {contract}
      </ExpandableSection>
    )
  }
)

export default ContractListItem
