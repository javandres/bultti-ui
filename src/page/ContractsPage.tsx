import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { PageTitle } from '../common/components/Typography'
import { FlexRow, Page } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { contractsQuery } from '../contract/contractQueries'
import { MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle, TextButton } from '../common/components/Button'
import { Contract } from '../schema-types'
import ContractEditor from '../contract/ContractEditor'
import ContractListItem from '../contract/ContractListItem'
import { useStateValue } from '../state/useAppState'
import { DATE_FORMAT } from '../constants'
import { addYears, format } from 'date-fns'

const ContractPageView = styled(Page)``

const ContractContentView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const ContractPage = observer(({ children }: PropTypes) => {
  let [operator] = useStateValue('globalOperator')
  let [newContract, setNewContract] = useState<Partial<Contract> | null>(null)

  let { data: contractsData, loading: contractsLoading } = useQueryData(contractsQuery, {
    variables: {
      operatorId: operator?.id,
    },
  })

  // Contract ordered by their `order` prop.
  let contracts = useMemo(() => contractsData || [], [contractsData])

  const [contractsExpanded, setContractExpanded] = useState(false)

  const toggleContractExpanded = useCallback(() => {
    setContractExpanded((currentVal) => !currentVal)
  }, [])

  const onCreateNewContract = useCallback(() => {
    if (!operator) {
      return
    }

    setNewContract({
      operatorId: operator?.id,
      operator,
      startDate: format(new Date(), DATE_FORMAT),
      endDate: format(addYears(new Date(), 1), DATE_FORMAT),
    })
  }, [operator])

  return (
    <ContractPageView>
      <PageTitle>Sopimukset</PageTitle>
      {!contractsData && !contractsLoading && <MessageView>Ei sopimuksia...</MessageView>}
      <ContractContentView>
        <FlexRow>
          {contracts.length !== 0 && (
            <TextButton onClick={toggleContractExpanded}>
              {contractsExpanded ? 'Piilota kaikki sopimukset' : 'Näytä kaikki sopimukset'}
            </TextButton>
          )}
          {!newContract && (
            <Button
              disabled={!operator}
              onClick={onCreateNewContract}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              style={{ marginLeft: 'auto' }}>
              {!operator ? 'Valitse liikennöitsijä' : 'Uusi sopimus'}
            </Button>
          )}
        </FlexRow>
        {newContract && (
          <ContractListItem key="new" contractData={newContract as Contract} isExpanded={true}>
            <ContractEditor
              isNew={true}
              onCancel={() => setNewContract(null)}
              contract={newContract as Contract}
            />
          </ContractListItem>
        )}
        {contracts.map((contractItem) => (
          <ContractListItem
            key={contractItem.id}
            contractData={contractItem}
            isExpanded={contractsExpanded}>
            <ContractEditor contract={contractItem} />
          </ContractListItem>
        ))}
      </ContractContentView>
    </ContractPageView>
  )
})

export default ContractPage
