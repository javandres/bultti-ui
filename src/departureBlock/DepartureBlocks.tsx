import React, { useContext, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { InspectionContext } from '../inspection/InspectionContext'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'
import { Text } from '../util/translate'
import { useQueryData } from '../util/useQueryData'
import { departureBlocksQuery, saveDepartureBlocksMutation } from './departureBlocksQuery'
import { OperatorBlockDeparture } from '../schema-types'
import { LoadingDisplay } from '../common/components/Loading'
import PagedTable from '../common/table/PagedTable'
import { Button, ButtonSize } from '../common/components/buttons/Button'
import { FlexRow } from '../common/components/common'
import { useMutationData } from '../util/useMutationData'
import { inspectionQuery } from '../inspection/inspectionQueries'
import { uniqBy } from 'lodash'

const DepartureBlocksView = styled.div`
  margin-bottom: 0;
  min-height: 10rem;
  position: relative;
`

type PropTypes = {
  isEditable: boolean
  isValid: boolean
}

const DepartureBlocks: React.FC<PropTypes> = observer(({ isEditable, isValid }) => {
  const inspection = useContext(InspectionContext)
  const inspectionId = inspection?.id || ''

  let { data: departureBlocks = [], loading, refetch } = useQueryData<
    OperatorBlockDeparture[]
  >(departureBlocksQuery, {
    notifyOnNetworkStatusChange: true,
    skip: !inspectionId,
    variables: {
      inspectionId,
    },
  })

  let [
    fetchDepartureBlocks,
    { data: fetchedDepartureBlocks = [], loading: fetchLoading },
  ] = useMutationData<OperatorBlockDeparture[]>(saveDepartureBlocksMutation, {
    variables: {
      inspectionId,
    },
    refetchQueries: [
      {
        query: inspectionQuery,
        variables: {
          inspectionId,
        },
      },
    ],
  })

  let currentDepartureBlocks = useMemo(
    () => uniqBy([...departureBlocks, ...(fetchedDepartureBlocks || [])], 'id'),
    [fetchedDepartureBlocks, departureBlocks]
  )

  // TODO: Localization

  return (
    <ExpandableSection
      error={!isValid}
      headerContent={
        <HeaderMainHeading>
          <Text>departureBlocks</Text>
        </HeaderMainHeading>
      }>
      <DepartureBlocksView>
        <LoadingDisplay loading={loading || fetchLoading} />
        {!(loading || fetchLoading) && currentDepartureBlocks.length === 0 ? (
          <FlexRow>
            <Button onClick={() => fetchDepartureBlocks()} loading={fetchLoading}>
              Fetch departure blocks
            </Button>
          </FlexRow>
        ) : (
          <>
            <FlexRow>
              <Button
                style={{ marginLeft: 'auto' }}
                size={ButtonSize.SMALL}
                onClick={() => refetch()}
                loading={loading}>
                <Text>update</Text>
              </Button>
            </FlexRow>
            <PagedTable items={currentDepartureBlocks} />
          </>
        )}
      </DepartureBlocksView>
    </ExpandableSection>
  )
})

export default DepartureBlocks
