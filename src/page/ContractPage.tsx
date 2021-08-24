import React, { FC, useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { FlexRow, Page, PageContainer } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { Text } from '../util/translate'
import { contractsQuery } from '../contract/contractQueries'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { useStateValue } from '../state/useAppState'
import { useHasAdminAccessRights } from '../util/userRoles'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { orderBy } from 'lodash'
import { PageTitle } from '../common/components/PageTitle'
import { useRefetch } from '../util/useRefetch'
import { LinkButton } from '../common/components/buttons/LinkButton'
import { operatorIsValid } from '../common/input/SelectOperator'
import { Contract } from '../schema-types'
import { RouteChildrenProps } from 'react-router-dom'
import { useNavigate } from '../util/urlValue'

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

export type PropTypes = RouteChildrenProps

const OperatorContractsListPage: FC<PropTypes> = observer(() => {
  let [operator] = useStateValue('globalOperator')
  let hasAccessRights = useHasAdminAccessRights()

  let {
    data: contractsData,
    loading: contractsLoading,
    refetch: refetchContracts,
  } = useQueryData<Contract[]>(contractsQuery, {
    variables: {
      operatorId: operator?.id,
    },
  })

  let refetch = useRefetch(refetchContracts)

  let contracts = useMemo(() => orderBy(contractsData || [], 'startDate', 'desc'), [
    contractsData,
  ])

  let navigate = useNavigate()

  const onOpenContract = useCallback(
    (contractId) => {
      return navigate.push(`/contract/${contractId}`)
    },
    [navigate]
  )

  const onCreateNewContract = useCallback(() => {
    if (!operatorIsValid(operator)) {
      return
    }

    onOpenContract('new')
  }, [operator])

  return (
    <ContractPageView>
      <PageTitle loading={contractsLoading} onRefresh={refetch}>
        <Text>contracts</Text>
      </PageTitle>
      <PageContainer>
        {contracts.length === 0 && !contractsLoading && (
          <MessageContainer>
            <MessageView>
              <Text>contractPage_noContracts</Text>
            </MessageView>
          </MessageContainer>
        )}
        {hasAccessRights && (
          <FlexRow style={{ margin: '1rem' }}>
            <Button
              disabled={!operatorIsValid(operator)}
              onClick={onCreateNewContract}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              style={{ marginLeft: 'auto' }}>
              <Text>contractPage_newContractButton</Text>
            </Button>
          </FlexRow>
        )}
        <ContractContentView>
          {contracts.map((contractItem) => (
            <LinkButton
              key={contractItem.id}
              onClick={() => onOpenContract(contractItem.id)}
              style={{ padding: '1rem 1rem 1rem 1.5rem' }}>
              <ContractTitle>{contractItem?.operator?.operatorName}</ContractTitle>
              {contractItem?.description && (
                <ContractDescription>{contractItem?.description}</ContractDescription>
              )}
              <ContractDates
                startDate={contractItem.startDate as string}
                endDate={contractItem.endDate as string}
              />
            </LinkButton>
          ))}
        </ContractContentView>
      </PageContainer>
    </ContractPageView>
  )
})

export default OperatorContractsListPage
