import React, { useEffect } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Redirect, RouteChildrenProps, useHistory, useParams } from 'react-router-dom'
import { useQueryData } from '../util/useQueryData'
import { contractQuery } from '../contract/contractQueries'
import ContractEditor from '../contract/ContractEditor'
import { Contract, UserRole } from '../schema-types'
import { useHasAccessRights, useHasAdminAccessRights } from '../util/userRoles'
import { LoadingDisplay } from '../common/components/Loading'
import { Page, PageContainer } from '../common/components/common'
import { useRefetch } from '../util/useRefetch'
import { Text } from '../util/translate'
import { PageTitle } from '../common/components/PageTitle'

const EditContractPageView = styled(Page)``

export type PropTypes = RouteChildrenProps

const EditContractPage: React.FC<PropTypes> = observer(() => {
  let { contractId = '' } = useParams<{ contractId?: string }>()

  let hasAccessRights = useHasAccessRights({
    allowedRoles: 'all',
    operatorId: 'all',
  })

  let hasAdminAccessRights = useHasAdminAccessRights()
  let isNew = contractId === 'new'

  let {
    data: contract,
    loading,
    refetch: refetchContract,
  } = useQueryData<Contract | undefined>(contractQuery, {
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
                <Text>contract</Text>
              </>
            ) : (
              <>
                <Text>contractPage_createNewContract</Text>
              </>
            )}
          </>
        )}
      </PageTitle>
      <PageContainer>
        <LoadingDisplay loading={loading} />
        {!loading && (
          <ContractEditor
            onRefresh={refetch}
            editable={hasAdminAccessRights}
            contract={contract}
            isNew={isNew}
          />
        )}
      </PageContainer>
    </EditContractPageView>
  )
})

export default EditContractPage
