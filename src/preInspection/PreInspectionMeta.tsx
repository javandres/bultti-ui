import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'
import { PreInspectionContext } from './PreInspectionContext'
import styled from 'styled-components'
import {
  LoadingMeta,
  MetaDisplay,
  MetaItem,
  MetaLabel,
  MetaValue,
} from '../common/components/MetaDisplay'
import { InputLabel } from '../common/components/form'
import { getCreatedBy } from './inspectionUtils'

const PreInspectionMetaView = styled.div`
  margin-bottom: 2.5rem;
`

const MetaHeading = styled(InputLabel).attrs(() => ({ theme: 'light' }))`
  margin-top: 0;
`

type PropTypes = {
  isLoading?: boolean
  className?: string
}

const PreInspectionMeta: React.FC<PropTypes> = observer(({ className, isLoading }) => {
  const inspection = useContext(PreInspectionContext)

  if (!inspection) {
    return null
  }

  let createdBy = getCreatedBy(inspection)

  return (
    <PreInspectionMetaView className={className}>
      <MetaHeading>Ennakkotarkastuksen tiedot</MetaHeading>
      <MetaDisplay>
        <LoadingMeta inline={true} loading={isLoading} />
        <MetaItem>
          <MetaLabel>Perustettu</MetaLabel>
          <MetaValue>{format(parseISO(inspection.createdAt), READABLE_TIME_FORMAT)}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Viimeksi muokattu</MetaLabel>
          <MetaValue>{format(parseISO(inspection.updatedAt), READABLE_TIME_FORMAT)}</MetaValue>
        </MetaItem>
        {createdBy && (
          <MetaItem>
            <MetaLabel>Käyttäjä</MetaLabel>
            <MetaValue>
              {createdBy?.name} ({createdBy?.organisation})
            </MetaValue>
          </MetaItem>
        )}
      </MetaDisplay>
    </PreInspectionMetaView>
  )
})

export default PreInspectionMeta
