import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
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

const PreInspectionMetaView = styled.div`
  margin-left: 1rem;
  margin-bottom: 2rem;
`

const MetaHeading = styled(InputLabel).attrs(() => ({ theme: 'light' }))`
  margin-top: 0;
`

type PropTypes = {
  isLoading?: boolean
  buttonAction?: () => unknown
  buttonStyle?: ButtonStyle
  buttonLabel?: string
  className?: string
}

const PreInspectionMeta: React.FC<PropTypes> = observer(
  ({ className, isLoading, buttonAction, buttonStyle = ButtonStyle.NORMAL, buttonLabel }) => {
    const preInspection = useContext(PreInspectionContext)

    if (!preInspection) {
      return null
    }

    return (
      <PreInspectionMetaView className={className}>
        <MetaHeading>Ennakkotarkastuksen tiedot</MetaHeading>
        <MetaDisplay>
          <LoadingMeta inline={true} loading={isLoading} />
          <MetaItem>
            <MetaLabel>Perustettu</MetaLabel>
            <MetaValue>
              {format(parseISO(preInspection.createdAt), READABLE_TIME_FORMAT)}
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Viimeksi muokattu</MetaLabel>
            <MetaValue>
              {format(parseISO(preInspection.updatedAt), READABLE_TIME_FORMAT)}
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Käyttäjä</MetaLabel>
            <MetaValue>
              {preInspection.createdBy?.name} ({preInspection.createdBy?.organisation})
            </MetaValue>
          </MetaItem>
          {buttonAction && (
            <MetaItem style={{ marginLeft: 'auto', border: 'none' }}>
              <Button size={ButtonSize.LARGE} buttonStyle={buttonStyle} onClick={buttonAction}>
                {buttonLabel || 'Julkaise'}
              </Button>
            </MetaItem>
          )}
        </MetaDisplay>
      </PreInspectionMetaView>
    )
  }
)

export default PreInspectionMeta
