import React, { FC, useCallback } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { FlexRow, Page, PageContainer } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { Text } from '../util/translate'
import { contractsQuery } from '../contract/contractQueries'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { useHasAdminAccessRights } from '../util/userRoles'
import { PageTitle } from '../common/components/PageTitle'
import { useRefetch } from '../util/useRefetch'
import { LinkButton } from '../common/components/buttons/LinkButton'
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

const ContractDescription = styled.div`
  font-size: 0.875rem;
  margin-right: 1rem;
`

export type PropTypes = RouteChildrenProps

const OperatorContractsListPage: FC<PropTypes> = observer(() => {
  let hasAccessRights = useHasAdminAccessRights()

  let {
    data: contracts,
    loading: contractsLoading,
    refetch: refetchContracts,
  } = useQueryData<Contract[]>(contractsQuery)

  let refetch = useRefetch(refetchContracts)
  let navigate = useNavigate()

  const onOpenContract = useCallback(
    (contractId) => {
      return navigate.push(`/contract/${contractId}`)
    },
    [navigate]
  )

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
              onClick={() => onOpenContract('new')}
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
              {contractItem?.description && (
                <ContractDescription>{contractItem?.description}</ContractDescription>
              )}
            </LinkButton>
          ))}
        </ContractContentView>
      </PageContainer>
    </ContractPageView>
  )
})

export default OperatorContractsListPage
