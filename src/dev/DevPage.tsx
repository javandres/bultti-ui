import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { PageTitle } from '../common/components/PageTitle'
import { PageContainer } from '../common/components/common'
import { Button, ButtonSize } from '../common/components/buttons/Button'
import { gql, useMutation } from '@apollo/client'
import { useMutationData } from '../util/useMutationData'
import { useHasAdminAccessRights } from '../util/userRoles'
import Input from '../common/input/Input'
import { useQueryData } from '../util/useQueryData'
import { inspectionQuery } from '../inspection/inspectionQueries'
import InspectionCard from '../inspection/InspectionCard'
import { DEBUG } from '../constants'
import { Inspection } from '../schema-types'
import { RouteChildrenProps } from 'react-router-dom'

const AdminPageView = styled.div``
const LENGTH_OF_VALID_INSPECTION_UUID = 36

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

const removeUserMutation = gql`
  mutation removeUser($email: String!) {
    removeUser(email: $email)
  }
`

const forceRemoveInspectionMutation = gql`
  mutation forceRemoveInspection($inspectionId: String!, $testOnly: Boolean) {
    forceRemoveInspection(inspectionId: $inspectionId, testOnly: $testOnly)
  }
`

const helperResolverMutation = gql`
  mutation helperResolver {
    helperResolver
  }
`

const clearCacheMutation = gql`
  mutation clearCache {
    clearCache
  }
`

export type PropTypes = RouteChildrenProps

const DevPage: React.FC<PropTypes> = observer(({ children }) => {
  let [createTestData, { loading: testDataLoading }] = useMutationData(createTestDataMutation)

  let [removeTestData, { loading: testDataRemoveLoading }] =
    useMutationData(removeTestDataMutation)

  let [removeUser, { loading: isRemoveUserLoading }] = useMutationData(removeUserMutation)

  let [forceRemoveInspection, { loading: forceRemoveInspectionLoading }] = useMutationData(
    forceRemoveInspectionMutation
  )

  let [helperResolver] = useMutationData(helperResolverMutation)

  let isAdmin = useHasAdminAccessRights()

  useEffect(() => {
    if (!isAdmin) {
      window.history.back()
    }
  }, [isAdmin])

  let [removeUserEmail, setRemoveUserEmail] = useState('')

  let onRemoveUser = useCallback(() => {
    if (
      confirm(
        `Are you sure you want to remove this user: ${removeUserEmail}? All relations related to the user (contract and inspections) will be removed.`
      )
    ) {
      setRemoveUserEmail('')
      removeUser({
        variables: {
          email: removeUserEmail,
        },
      })
    }
  }, [removeUserEmail, forceRemoveInspection])

  let [removeInspectionId, setRemoveInspectionId] = useState('')

  let { data: inspection } = useQueryData<Inspection>(inspectionQuery, {
    // Do not fetch inspection preview before the full UUID is written in the input.
    skip: removeInspectionId.length < LENGTH_OF_VALID_INSPECTION_UUID,
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
          // this is dangerous so it's allowed only if DEBUG = true
          testOnly: !DEBUG,
        },
      })
    }
  }, [removeInspectionId, forceRemoveInspection])

  let onHelperResolver = () => {
    helperResolver()
  }

  const [clearCache] = useMutation(clearCacheMutation)

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
          <br />
          <strong>Important!</strong> If you change or fix test data generator code, be sure to
          first <em>remove</em> the old test data before creating new test data with the
          updated code. Otherwise all test data may not be properly updated.
        </p>
        <Button loading={testDataLoading} onClick={() => createTestData()}>
          Create test data
        </Button>

        <h3>Remove test data</h3>
        <p>
          Remove test data created with th above function. Note that test inspections need to
          be removed first.
        </p>
        <Button loading={testDataRemoveLoading} onClick={() => removeTestData()}>
          Remove test data
        </Button>

        <h3>Remove user</h3>
        <Input
          style={{ marginBottom: '1rem' }}
          label="User email address to remove"
          value={removeUserEmail}
          onChange={(val) => setRemoveUserEmail(val)}
        />
        <Button
          disabled={removeUserEmail.length === 0}
          loading={isRemoveUserLoading}
          onClick={onRemoveUser}>
          Remove user
        </Button>

        <h3>Force remove inspections</h3>
        <p>
          <b>Pre inspections for the selected operator</b>
        </p>
        <p>TODO: query a list of pre inspections here.</p>
        <p>
          <b>Post inspections for the selected operator</b>
        </p>
        <p>TODO: query a list of post inspections here.</p>
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
        <p>
          <Button
            loading={forceRemoveInspectionLoading}
            onClick={onRemoveInspection}
            disabled={removeInspectionId.length !== LENGTH_OF_VALID_INSPECTION_UUID}>
            Force remove inspection
          </Button>
        </p>
        <p>
          <Button onClick={onHelperResolver}>Call helperResolver</Button>
        </p>
        <h3>Clear cache</h3>
        <p>
          Clears the whole Redis cache of the app, including queued jobs.
          <Button
            style={{ color: 'white ', border: '1px solid white', marginTop: '1rem' }}
            onClick={() => clearCache()}
            size={ButtonSize.MEDIUM}>
            <div>Clear cache</div>
          </Button>
        </p>
      </PageContainer>
    </AdminPageView>
  )
})

export default DevPage
