import React, { FC, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { FlexRow, Page, PageContainer } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { Text } from '../util/translate'
import { contractsQuery } from '../contract/contractQueries'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import { useHasAdminAccessRights } from '../util/userRoles'
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
`

const ContractTitle = styled.h4`
  margin: 0 1rem 0 0;
  flex: 1 0;
  white-space: nowrap;
  align-self: flex-start;
`

const ContractDescription = styled.div`
  font-size: 0.875rem;
  margin-right: 1rem;
`

const ContractDates = styled(DateRangeDisplay)`
  margin-left: auto;
  flex: 0;
  align-self: flex-start;
`

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

export type PropTypes = RouteComponentProps

const OperatorContractsListPage: FC<PropTypes> = observer(() => {
  let [operator] = useStateValue('globalOperator')
  let hasAccessRights = useHasAdminAccessRights()

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
        <Text>contract_page.contracts</Text>
      </PageTitle>
      <PageContainer>
        {contracts.length === 0 && !contractsLoading && (
          <MessageContainer>
            <MessageView>
              <Text>contract_page.no_contracts</Text>
            </MessageView>
          </MessageContainer>
        )}
        {hasAccessRights && (
          <FlexRow style={{ margin: '1rem' }}>
            <Button
              disabled={!operator}
              onClick={onCreateNewContract}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              style={{ marginLeft: 'auto' }}>
              <Text>contract_page.new_contract_button</Text>
            </Button>
          </FlexRow>
        )}
        <ContractContentView>
          {contracts.map((contractItem) => (
            <ContractListItem
              key={contractItem.id}
              onClick={() => onOpenContract(contractItem.id)}>
              <ContractTitle>{contractItem?.operator?.operatorName}</ContractTitle>
              {contractItem?.description && (
                <ContractDescription>{contractItem?.description}</ContractDescription>
              )}

              <ContractDates
                startDate={contractItem.startDate}
                endDate={contractItem.endDate}
              />
              <GoToContractButton>
                <ArrowRight fill="var(--blue)" width="1.5rem" height="1.5rem" />
              </GoToContractButton>
            </ContractListItem>
          ))}
        </ContractContentView>
      </PageContainer>
    </ContractPageView>
  )
})

export default OperatorContractsListPage
