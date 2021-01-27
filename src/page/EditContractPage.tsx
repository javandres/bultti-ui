import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Redirect, RouteComponentProps } from '@reach/router'
import { useQueryData } from '../util/useQueryData'
import { contractQuery } from '../contract/contractQueries'
import ContractEditor from '../contract/ContractEditor'
import { Contract } from '../schema-types'
import { useStateValue } from '../state/useAppState'
import { useHasAdminAccessRights, useHasOperatorUserAccessRights } from '../util/userRoles'
import { addYears } from 'date-fns'
import { LoadingDisplay } from '../common/components/Loading'
import { Page } from '../common/components/common'
import { useRefetch } from '../util/useRefetch'
import { PageTitle } from '../common/components/PageTitle'
import { navigateWithQueryString } from '../util/urlValue'
import { getDateString } from '../util/formatDate'

const EditContractPageView = styled(Page)``

export type PropTypes = {
  contractId?: string
} & RouteComponentProps

const EditContractPage = observer(({ contractId }: PropTypes) => {
  let [operator] = useStateValue('globalOperator')

  let hasOperatorAccess = useHasOperatorUserAccessRights(operator?.id)
  let hasAdminAccessRights = useHasAdminAccessRights()

  let [newContract, setNewContract] = useState<Partial<Contract> | null>(null)

  let onCancel = useCallback(() => {
    setNewContract(null)
  }, [])

  let { data: existingContract, loading, refetch: refetchContract } = useQueryData(
    contractQuery,
    {
      notifyOnNetworkStatusChange: true,
      skip: !contractId || contractId === 'new',
      variables: { contractId },
    }
  )

  let refetch = useRefetch(refetchContract)

  useEffect(() => {
    if (contractId === 'new' && !newContract && !!operator) {
      setNewContract({
        operatorId: operator?.id,
        operator,
        startDate: getDateString(new Date()),
        endDate: getDateString(addYears(new Date(), 1)),
      })
    }
  }, [contractId, newContract, operator])

  useEffect(() => {
    if (!existingContract && !loading && contractId !== 'new') {
      navigateWithQueryString('/contract', { replace: true })
    }
  }, [contractId, existingContract, loading])

  let contractData = useMemo(() => (contractId === 'new' ? newContract : existingContract), [
    existingContract,
    newContract,
    contractId,
  ])

  if (!hasOperatorAccess) {
    return <Redirect noThrow to="/contract" />
  }

  return (
    <EditContractPageView>
      <PageTitle loading={loading} onRefresh={refetch}>
        Muokkaa sopimusehdot
      </PageTitle>
      <LoadingDisplay loading={loading} />
      {!!contractData && (
        <ContractEditor
          onRefresh={refetch}
          onReset={onCancel}
          editable={hasAdminAccessRights}
          contract={contractData}
          isNew={contractId === 'new'}
        />
      )}
    </EditContractPageView>
  )
})

export default EditContractPage
