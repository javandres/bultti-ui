import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { useQueryData } from '../util/useQueryData'
import { contractQuery } from '../contract/contractQueries'
import ContractEditor from '../contract/ContractEditor'
import { Contract } from '../schema-types'
import { useStateValue } from '../state/useAppState'
import { DATE_FORMAT } from '../constants'
import { hasAdminAccessRights } from '../util/userRoles'
import { addYears, format } from 'date-fns'
import { LoadingDisplay } from '../common/components/Loading'
import { Page } from '../common/components/common'
import { useRefetch } from '../util/useRefetch'
import { PageTitle } from '../common/components/PageTitle'
import { navigateWithQueryString } from '../util/urlValue'

const EditContractPageView = styled(Page)``

export type PropTypes = {
  contractId?: string
} & RouteComponentProps

const EditContractPage = observer(({ contractId }: PropTypes) => {
  let [operator] = useStateValue('globalOperator')
  let [user] = useStateValue('user')

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
        startDate: format(new Date(), DATE_FORMAT),
        endDate: format(addYears(new Date(), 1), DATE_FORMAT),
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
          editable={hasAdminAccessRights(user)}
          contract={contractData}
          isNew={contractId === 'new'}
        />
      )}
    </EditContractPageView>
  )
})

export default EditContractPage
