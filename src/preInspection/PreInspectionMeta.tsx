import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import {
  LoadingMeta,
  MetaDisplay,
  MetaItem,
  MetaLabel,
  MetaValue,
} from '../common/components/common'
import Loading from '../common/components/Loading'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'
import { Button, ButtonSize } from '../common/components/Button'
import { PreInspectionContext } from './PreInspectionContext'

type PropTypes = {
  isLoading: boolean
  onClickPublish: () => void
}

const PreInspectionMeta: React.FC<PropTypes> = observer(({ isLoading, onClickPublish }) => {
  const preInspection = useContext(PreInspectionContext)

  if (!preInspection) {
    return null
  }

  return (
    <MetaDisplay>
      <LoadingMeta inline={true} loading={isLoading}>
        <Loading inline={true} />
      </LoadingMeta>
      <MetaItem>
        <MetaLabel>Perustettu</MetaLabel>
        <MetaValue>{format(parseISO(preInspection.createdAt), READABLE_TIME_FORMAT)}</MetaValue>
      </MetaItem>
      <MetaItem>
        <MetaLabel>Viimeksi muokattu</MetaLabel>
        <MetaValue>{format(parseISO(preInspection.updatedAt), READABLE_TIME_FORMAT)}</MetaValue>
      </MetaItem>
      <MetaItem>
        <MetaLabel>Käyttäjä</MetaLabel>
        <MetaValue>
          {preInspection.createdBy?.name} ({preInspection.createdBy?.organisation})
        </MetaValue>
      </MetaItem>
      <MetaItem style={{ marginLeft: 'auto', border: 'none' }}>
        <Button size={ButtonSize.LARGE} onClick={onClickPublish}>
          Julkaise tuotantoon
        </Button>
      </MetaItem>
    </MetaDisplay>
  )
})

export default PreInspectionMeta
