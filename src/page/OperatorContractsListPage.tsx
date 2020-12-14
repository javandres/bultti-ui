import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { FlexRow, Page } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { Text } from '../util/translate'
import { contractsQuery } from '../contract/contractQueries'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import { requireAdminUser } from '../util/userRoles'
import { ArrowRight } from '../common/icon/ArrowRight'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { navigateWithQueryString } from '../util/urlValue'
import { orderBy } from 'lodash'
import { PageTitle } from '../common/components/PageTitle'
import { useRefetch } from '../util/useRefetch'

const ContractPageView = styled(Page)``

const ContractContentView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

const ContractTitle = styled.h4`
  margin: 0 1rem 0 0;
`

const ContractDates = styled(DateRangeDisplay)``

const ContractListItem = styled.button`
  font-family: inherit;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  padding: 1rem 0.5rem 1rem 1rem;
  margin-bottom: 1rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--dark-grey);
  transform: scale(1);
  transition: all 0.1s ease-out;

  &:hover {
    background-color: #fafafa;
    transform: ${({ disabled = false }) => (!disabled ? 'scale(1.01)' : 'scale(1)')};
  }
`

const GoToContractButton = styled.div`
  background: transparent;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  border-top-right-radius: 0.5rem;
  margin-left: auto;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
`

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const OperatorContractsListPage = observer(({ children }: PropTypes) => {
  let [operator] = useStateValue('globalOperator')
  let [user] = useStateValue('user')

  let {
    data: contractsData,
    loading: contractsLoading,
    refetch: refetchContracts,
  } = useQueryData(contractsQuery, {
    variables: {
      operatorId: operator?.id,
    },
  })

  let refetch = useRefetch(refetchContracts)

  let contracts = useMemo(() => orderBy(contractsData || [], 'startDate', 'desc'), [
    contractsData,
  ])

  const onOpenContract = useCallback((contractId) => {
    return navigateWithQueryString(`/contract/${contractId}`)
  }, [])

  const onCreateNewContract = useCallback(() => {
    if (!operator) {
      return
    }

    onOpenContract('new')
  }, [operator])

  return (
    <ContractPageView>
      <PageTitle loading={contractsLoading} onRefresh={refetch}>
        <Text>operator_contract_list.contracts</Text>
      </PageTitle>
      {contracts.length === 0 && !contractsLoading && (
        <MessageContainer>
          <MessageView>
            <Text>operator_contract_list.no_contracts</Text>
          </MessageView>
        </MessageContainer>
      )}
      {!!operator && requireAdminUser(user) && (
        <FlexRow style={{ marginTop: '-0.5rem', marginBottom: '1rem', marginRight: '1rem' }}>
          <Button
            disabled={!operator}
            onClick={onCreateNewContract}
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.MEDIUM}
            style={{ marginLeft: 'auto' }}>
            <Text>operator_contract_list.new_contract_button</Text>
          </Button>
        </FlexRow>
      )}
      <ContractContentView>
        {contracts.map((contractItem) => (
          <ContractListItem
            key={contractItem.id}
            onClick={() => onOpenContract(contractItem.id)}>
            <ContractTitle>{contractItem?.operator?.operatorName}</ContractTitle>
            <ContractDates startDate={contractItem.startDate} endDate={contractItem.endDate} />
            <GoToContractButton>
              <ArrowRight fill="var(--blue)" width="1.5rem" height="1.5rem" />
            </GoToContractButton>
          </ContractListItem>
        ))}
      </ContractContentView>
    </ContractPageView>
  )
})

export default OperatorContractsListPage
