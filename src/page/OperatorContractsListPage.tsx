import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { PageTitle } from '../common/components/Typography'
import { FlexRow, Page } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { contractsQuery } from '../contract/contractQueries'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import { requireAdminUser } from '../util/userRoles'
import { ArrowRight } from '../common/icon/ArrowRight'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { navigateWithQueryString } from '../util/urlValue'

const ContractPageView = styled(Page)``

const ContractContentView = styled.div`
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

  let { data: contractsData, loading: contractsLoading } = useQueryData(contractsQuery, {
    variables: {
      operatorId: operator?.id,
    },
  })

  let contracts = useMemo(() => contractsData || [], [contractsData])

  const onOpenContract = useCallback((contractId) => {
    return navigateWithQueryString(`/contract/${contractId}`)
  }, [])

  const onCreateNewContract = useCallback(() => {
    if (!operator) {
      return
    }

    onOpenContract('new')

    /**/
  }, [operator])

  return (
    <ContractPageView>
      <PageTitle>Sopimukset</PageTitle>
      {contracts.length === 0 && !contractsLoading && (
        <MessageContainer>
          <MessageView>Ei sopimuksia.</MessageView>
        </MessageContainer>
      )}
      <ContractContentView>
        <FlexRow>
          {!!operator && requireAdminUser(user) && (
            <Button
              disabled={!operator}
              onClick={onCreateNewContract}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              style={{ marginLeft: 'auto' }}>
              Uusi sopimus
            </Button>
          )}
        </FlexRow>
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
