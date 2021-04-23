import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { PageTitle } from '../common/components/PageTitle'
import { PageContainer } from '../common/components/common'
import { Button } from '../common/components/buttons/Button'
import { gql } from '@apollo/client'
import { useMutationData } from '../util/useMutationData'
import { useHasAdminAccessRights } from '../util/userRoles'
import Input from '../common/input/Input'
import { useQueryData } from '../util/useQueryData'
import { inspectionQuery } from '../inspection/inspectionQueries'
import InspectionCard from '../inspection/InspectionCard'

const AdminPageView = styled.div``

const createTestDataMutation = gql`
  mutation createTestData {
    createTestData
  }
`

const removeTestDataMutation = gql`
  mutation removeTestData {
    removeTestData
  }
`

const forceRemoveInspectionMutation = gql`
  mutation forceRemoveInspection($inspectionId: String!) {
    forceRemoveInspection(inspectionId: $inspectionId)
  }
`

export type PropTypes = RouteComponentProps

const AdminPage: React.FC<PropTypes> = observer(({ children }) => {
  let [createTestData, { loading: testDataLoading }] = useMutationData(createTestDataMutation)

  let [removeTestData, { loading: testDataRemoveLoading }] = useMutationData(
    removeTestDataMutation
  )

  let [forceRemoveInspection, { loading: forceRemoveInspectionLoading }] = useMutationData(
    forceRemoveInspectionMutation
  )

  let isAdmin = useHasAdminAccessRights()

  useEffect(() => {
    if (!isAdmin) {
      window.history.back()
    }
  }, [isAdmin])

  let [removeInspectionId, setRemoveInspectionId] = useState('')

  let { data: inspection } = useQueryData(inspectionQuery, {
    skip: removeInspectionId.length < 36,
    nextFetchPolicy: !removeInspectionId ? 'network-only' : 'cache-first',
    variables: {
      inspectionId: removeInspectionId,
    },
  })

  return (
    <AdminPageView>
      <PageTitle>Admin</PageTitle>
      <PageContainer>
        <h3>Create test data</h3>
        <p>
          Create test data for testing the application. Test data is deterministic and will not
          be "doubled".
        </p>
        <Button loading={testDataLoading} onClick={() => createTestData()}>
          Create test data
        </Button>
        <h3>Remove test data</h3>
        <p>Remove test data created with th above function.</p>
        <Button loading={testDataLoading} onClick={() => createTestData()}>
          Remove test data
        </Button>
        <h3>Force remove inspections</h3>
        <p>Force removal of inspections belonging to the test season.</p>
        <Input value={removeInspectionId} onChange={(val) => setRemoveInspectionId(val)} />

        {inspection && <InspectionCard onRefresh={() => {}} inspection={inspection} />}

        <Button
          loading={forceRemoveInspectionLoading}
          onClick={() => {
            if (
              confirm(
                'Are you sure you want to remove this inspection? All inspections that are linked to it will also be removed.'
              )
            ) {
              setRemoveInspectionId('')
              forceRemoveInspection({
                variables: {
                  inspectionId: removeInspectionId,
                },
              })
            }
          }}>
          Force remove inspection
        </Button>
      </PageContainer>
    </AdminPageView>
  )
})

export default AdminPage
