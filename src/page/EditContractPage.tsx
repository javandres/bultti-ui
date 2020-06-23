import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { useQueryData } from '../util/useQueryData'
import { contractQuery } from '../contract/contractQueries'
import ContractEditor from '../contract/ContractEditor'
import { Contract } from '../schema-types'
import { useStateValue } from '../state/useAppState'
import { DATE_FORMAT } from '../constants'
import { requireAdminUser } from '../util/userRoles'
import { addYears, format } from 'date-fns'
import { LoadingDisplay } from '../common/components/Loading'
import { PageTitle } from '../common/components/Typography'
import { Page } from '../common/components/common'

const EditContractPageView = styled(Page)``

export type PropTypes = {
  contractId?: string
} & RouteComponentProps

const EditContractPage = observer(({ contractId }: PropTypes) => {
  let [operator] = useStateValue('globalOperator')
  let [user] = useStateValue('user')

  let { data: existingContract, loading } = useQueryData(contractQuery, {
    skip: !contractId || contractId === 'new',
    variables: { contractId },
  })

  let [newContract, setNewContract] = useState<Partial<Contract> | null>(null)

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

  let contractData = useMemo(() => (contractId === 'new' ? newContract : existingContract), [
    existingContract,
    newContract,
    contractId,
  ])

  return (
    <EditContractPageView>
      <PageTitle>Muokkaa sopimus</PageTitle>
      <LoadingDisplay loading={loading} />
      {!!contractData && (
        <ContractEditor
          editable={requireAdminUser(user)}
          contract={contractData}
          isNew={contractId === 'new'}
        />
      )}
    </EditContractPageView>
  )
})

export default EditContractPage
