import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract } from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import { READABLE_DATE_FORMAT } from '../constants'

const ContractTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`

const ContractDescription = styled.p`
  margin: 0;
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
                {contractData?.operator?.operatorName || 'Uusi sopimus'} /{' '}
                {(contractData?.startDate, READABLE_DATE_FORMAT)} -{' '}
                {(contractData?.endDate, READABLE_DATE_FORMAT)}
              </ContractTitle>
              <ContractDescription>{contractData.description}</ContractDescription>
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
