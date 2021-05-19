import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
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
import { pickGraphqlData } from '../util/pickGraphqlData'
import { saveAs } from 'file-saver'
import { DEBUG } from '../constants'
import { DepartureBlockFile, Inspection } from '../schema-types'
import { RouteChildrenProps } from 'react-router-dom'

const AdminPageView = styled.div``
const LENGTH_OF_VALID_INSPECTION_UUID = 36

const createTestDataMutation = gql`
  mutation createTestData {
    createTestData
  }
`

const generateTestBlockDeparturesMutation = gql`
  mutation generateTestBlockDepartures {
    generateTestBlockDepartures {
      blockFile
      dayType
      operatorId
    }
  }
`

const removeTestDataMutation = gql`
  mutation removeTestData {
    removeTestData
  }
`

const forceRemoveInspectionMutation = gql`
  mutation forceRemoveInspection($inspectionId: String!, $testOnly: Boolean) {
    forceRemoveInspection(inspectionId: $inspectionId, testOnly: $testOnly)
  }
`

async function base64ToBlob(base64?: string) {
  if (!base64) {
    return
  }

  let response = await fetch('data:text/csv;base64,' + base64)
  return response.blob()
}

export type PropTypes = RouteChildrenProps

const DevPage: React.FC<PropTypes> = observer(({ children }) => {
  let [createTestData, { loading: testDataLoading }] = useMutationData(createTestDataMutation)
  let [generateTestBlocks, { loading: testBlocksLoading }] = useMutationData(
    generateTestBlockDeparturesMutation
  )

  let [removeTestData, { loading: testDataRemoveLoading }] =
    useMutationData(removeTestDataMutation)

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

  let onGenerateTestBlocks = useCallback(async () => {
    let response = await generateTestBlocks()
    let departureBlockFiles: DepartureBlockFile[] = pickGraphqlData(response.data) || []

    for (let blockFile of departureBlockFiles) {
      let blob = await base64ToBlob(blockFile.blockFile)
      let filename = `test_blocks_${blockFile.operatorId}_${blockFile.dayType}.csv`
      saveAs(blob, filename)
    }
  }, [generateTestBlocks])

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

        <h3>Generate test departure blocks</h3>
        <p>
          Generates test departure block CSV's that fit the test data. Will provide four files
          to download.
        </p>
        <Button loading={testBlocksLoading} onClick={onGenerateTestBlocks}>
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

        <Button
          loading={forceRemoveInspectionLoading}
          onClick={onRemoveInspection}
          disabled={removeInspectionId.length !== LENGTH_OF_VALID_INSPECTION_UUID}>
          Force remove inspection
        </Button>
      </PageContainer>
    </AdminPageView>
  )
})

export default DevPage
