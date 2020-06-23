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
import { requireAdminUser } from '../util/userRoles'
import { addYears, format } from 'date-fns'
import { LoadingDisplay } from '../common/components/Loading'
import { PageTitle } from '../common/components/Typography'
import { Page } from '../common/components/common'
import { useRefetch } from '../util/useRefetch'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'

const EditContractPageView = styled(Page)``

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;

  > * {
    margin-left: 1rem;
  }
`

export type PropTypes = {
  contractId?: string
} & RouteComponentProps

const EditContractPage = observer(({ contractId }: PropTypes) => {
  let [operator] = useStateValue('globalOperator')
  let [user] = useStateValue('user')

  let [newContract, setNewContract] = useState<Partial<Contract> | null>(null)

  let { data: existingContract, loading, refetch: refetchContract } = useQueryData(
    contractQuery,
    {
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

  let contractData = useMemo(() => (contractId === 'new' ? newContract : existingContract), [
    existingContract,
    newContract,
    contractId,
  ])

  let onCancel = useCallback(() => {
    setNewContract(null)
  }, [])

  return (
    <EditContractPageView>
      <PageTitle>
        Muokkaa sopimus
        <HeaderButtons>
          <Button
            size={ButtonSize.MEDIUM}
            buttonStyle={ButtonStyle.SECONDARY}
            onClick={refetch}>
            Päivitä
          </Button>
          <Button
            size={ButtonSize.MEDIUM}
            buttonStyle={ButtonStyle.SECONDARY_REMOVE}
            onClick={() => {
              /* TODO */
            }}>
            Peruuta
          </Button>
        </HeaderButtons>
      </PageTitle>
      <LoadingDisplay loading={loading} />
      {!!contractData && (
        <ContractEditor
          onRefresh={refetch}
          onCancel={onCancel}
          editable={requireAdminUser(user)}
          contract={contractData}
          isNew={contractId === 'new'}
        />
      )}
    </EditContractPageView>
  )
})

export default EditContractPage
