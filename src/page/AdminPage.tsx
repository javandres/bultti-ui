import React, { useCallback, useEffect, useState } from 'react'
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

const generateTestBlockDeparturesMutation = gql`
  mutation generateTestBlockDepartures {
    generateTestBlockDepartures
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
  let [generateTestBlocks, { loading: testBlocksLoading }] = useMutationData(
    generateTestBlockDeparturesMutation
  )

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

  let onRemoveInspection = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to remove this inspection? All inspections that are linked to it will also be removed.'
      )
    ) {
      setRemoveInspectionId('')
      forceRemoveInspection({
        variables: {
          inspectionId: removeInspectionId,
          // Non-test inspections can also be removed by adding testOnly: false,
          // but that is dangerous and not necessary for now.
        },
      })
    }
  }, [removeInspectionId, forceRemoveInspection])

  return (
    <AdminPageView>
      <PageTitle>Admin</PageTitle>
      <PageContainer>
        <h3>Create test data</h3>
        <p>
          Create test data for testing the application. Test data is deterministic and will not
          be "doubled".
          <br />
          Use season "TESTIKAUSI" and operator "Bultin testiliikennöitsijä" to create test
          inspections.
        </p>
        <Button loading={testDataLoading} onClick={() => createTestData()}>
          Create test data
        </Button>

        <h3>Generate test departure blocks</h3>
        <p>
          Generates test departure block CSV's that fit the test data. Check server console, it
          will be printed there. Copy and paste into files.
        </p>
        <Button loading={testBlocksLoading} onClick={() => generateTestBlocks()}>
          Generate test departure blocks
        </Button>

        <h3>Remove test data</h3>
        <p>
          Remove test data created with th above function. Note that test inspections need to
          be removed first.
        </p>
        <Button loading={testDataRemoveLoading} onClick={() => removeTestData()}>
          Remove test data
        </Button>

        <h3>Force remove inspections</h3>
        <p>
          Force removal of inspections belonging to the test season. Will also remove any
          inspections where this is linked from.
        </p>
        <Input
          style={{ marginBottom: '1rem' }}
          label="Inspection ID to remove"
          value={removeInspectionId}
          onChange={(val) => setRemoveInspectionId(val)}
        />

        {inspection && (
          <InspectionCard key={inspection.id} onRefresh={() => {}} inspection={inspection} />
        )}

        <Button loading={forceRemoveInspectionLoading} onClick={onRemoveInspection}>
          Force remove inspection
        </Button>
      </PageContainer>
    </AdminPageView>
  )
})

export default AdminPage
