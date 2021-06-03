import React, { useContext } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { InspectionContext } from '../inspection/InspectionContext'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'
import { Text } from '../util/translate'
import { useQueryData } from '../util/useQueryData'
import { previewDepartureBlocksQuery } from './blockDeparturesQuery'
import { OperatorBlockDeparture } from '../schema-types'
import { LoadingDisplay } from '../common/components/Loading'
import PagedTable from '../common/table/PagedTable'

const DepartureBlocksView = styled.div`
  margin-bottom: 0;
  position: relative;
`

type PropTypes = {
  isEditable: boolean
  isValid: boolean
}

const DepartureBlocks: React.FC<PropTypes> = observer(({ isEditable, isValid }) => {
  const inspection = useContext(InspectionContext)
  const inspectionId = inspection?.id || ''

  let { data: departureBlocks = [], loading } = useQueryData<OperatorBlockDeparture[]>(
    previewDepartureBlocksQuery,
    {
      skip: !inspectionId,
      variables: {
        inspectionId,
      },
    }
  )

  // TODO: Localization

  return (
    <ExpandableSection
      unmountOnClose={true}
      error={!isValid}
      headerContent={
        <HeaderMainHeading>
          <Text>departureBlocks</Text>
        </HeaderMainHeading>
      }>
      <DepartureBlocksView>
        <LoadingDisplay loading={loading} />
        <p>Esikatselu OMM:sta haetuista lähtöketjuista.</p>
        <PagedTable items={departureBlocks} />
      </DepartureBlocksView>
    </ExpandableSection>
  )
})

export default DepartureBlocks
