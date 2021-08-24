import React, { useEffect } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Redirect, RouteChildrenProps, useHistory, useParams } from 'react-router-dom'
import { useQueryData } from '../util/useQueryData'
import { contractQuery } from '../contract/contractQueries'
import ContractEditor from '../contract/ContractEditor'
import { Contract } from '../schema-types'
import { useStateValue } from '../state/useAppState'
import { useHasAccessRights, useHasAdminAccessRights } from '../util/userRoles'
import { LoadingDisplay } from '../common/components/Loading'
import { Page, PageContainer } from '../common/components/common'
import { useRefetch } from '../util/useRefetch'
import { Text } from '../util/translate'
import { MessageView } from '../common/components/Messages'
import { PageTitle } from '../common/components/PageTitle'

const EditContractPageView = styled(Page)``

const PageTitleOperator = styled.span`
  margin-left: 1rem;
  font-weight: normal;
`

export type PropTypes = RouteChildrenProps

const EditContractPage: React.FC<PropTypes> = observer(() => {
  let { contractId = '' } = useParams<{ contractId?: string }>()

  let [globalOperator] = useStateValue('globalOperator')

  let hasAccessRights = useHasAccessRights({
    allowedRoles: 'all',
    operatorId: globalOperator?.id,
  })

  let hasAdminAccessRights = useHasAdminAccessRights()
  let isNew = contractId === 'new'

  let { data: contract, loading, refetch: refetchContract } = useQueryData<
    Contract | undefined
  >(contractQuery, {
    notifyOnNetworkStatusChange: true,
    skip: !contractId || contractId === 'new',
    variables: { contractId },
  })

  let refetch = useRefetch(refetchContract)
  let history = useHistory()

  useEffect(() => {
    if (!contract && !loading && contractId !== 'new') {
      history.replace('/contract')
    }
  }, [contractId, contract, loading, history])

  if (!hasAccessRights) {
    return <Redirect to="/contract" />
  }

  return (
    <EditContractPageView>
      <PageTitle loading={loading} onRefresh={refetch}>
        {loading ? (
          <Text>contracts</Text>
        ) : (
          <>
            {contract ? (
              <>
                <Text>Sopimusehdot</Text>
                <PageTitleOperator>{contract.operator.operatorName}</PageTitleOperator>
              </>
            ) : (
              <>
                <Text>Luo uudet sopimusehdot</Text>
                <PageTitleOperator>{globalOperator?.operatorName}</PageTitleOperator>
              </>
            )}
          </>
        )}
      </PageTitle>
      <PageContainer>
        <LoadingDisplay loading={loading} />
        {!loading && (
          <>
            {isNew && !globalOperator ? (
              <MessageView>
                <Text>selectOperator</Text>
              </MessageView>
            ) : (
              <ContractEditor
                onRefresh={refetch}
                editable={hasAdminAccessRights}
                contract={contract}
                isNew={isNew}
              />
            )}
          </>
        )}
      </PageContainer>
    </EditContractPageView>
  )
})

export default EditContractPage
