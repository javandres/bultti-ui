import React from 'react'
import { observer } from 'mobx-react-lite'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'
import styled from 'styled-components'
import { MetaDisplay, MetaItem, MetaLabel, MetaValue } from '../common/components/MetaDisplay'
import { InputLabel } from '../common/components/form'
import { getAllUpdatedBy, getCreatedBy } from './inspectionUtils'
import { Inspection } from '../schema-types'

const PreInspectionMetaView = styled.div`
  margin-bottom: 2.5rem;
`

const MetaHeading = styled(InputLabel).attrs(() => ({ theme: 'light' }))`
  margin-top: 0;
`

type PropTypes = {
  className?: string
  inspection: Inspection
}

const InspectionMeta: React.FC<PropTypes> = observer(({ className, inspection }) => {
  let createdBy = getCreatedBy(inspection)
  let modifiedBy = getAllUpdatedBy(inspection)[0] || createdBy

  return (
    <PreInspectionMetaView className={className}>
      <MetaHeading>Tarkastuksen tiedot</MetaHeading>
      <MetaDisplay>
        <MetaItem>
          <MetaLabel>Perustettu</MetaLabel>
          <MetaValue>{format(parseISO(inspection.createdAt), READABLE_TIME_FORMAT)}</MetaValue>
          {createdBy && (
            <>
              <MetaLabel>Käyttäjä</MetaLabel>
              <MetaValue>
                {createdBy?.name} ({createdBy?.organisation})
              </MetaValue>
            </>
          )}
        </MetaItem>
        <MetaItem>
          <MetaLabel>Viimeksi muokattu</MetaLabel>
          <MetaValue>{format(parseISO(inspection.updatedAt), READABLE_TIME_FORMAT)}</MetaValue>
          {modifiedBy && (
            <>
              <MetaLabel>Käyttäjä</MetaLabel>
              <MetaValue>
                {modifiedBy.name} ({modifiedBy.organisation})
              </MetaValue>
            </>
          )}
        </MetaItem>
      </MetaDisplay>
    </PreInspectionMetaView>
  )
})

export default InspectionMeta