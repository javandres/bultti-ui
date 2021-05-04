import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { format, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'
import styled from 'styled-components/macro'
import { MetaDisplay, MetaItem, MetaLabel, MetaValue } from '../common/components/MetaDisplay'
import { InputLabel } from '../common/components/form'
import { getAllUpdatedByUsers, getCreatedByUser } from './inspectionUtils'
import { text } from '../util/translate'
import { TextButton } from '../common/components/buttons/Button'
import { Inspection } from './inspectionTypes'

const InspectionMetaView = styled.div`
  border: 1px solid var(--light-grey);
  padding: 1rem;
  border-radius: 0.5rem;
`

const InspectionMetaContainer = styled.div`
  margin-bottom: 0.5rem;
  margin-top: 1rem;
`

type PropTypes = {
  className?: string
  inspection: Inspection
}

const InspectionMeta: React.FC<PropTypes> = observer(({ className, inspection }) => {
  let createdBy = getCreatedByUser(inspection)
  let modifiedBy = getAllUpdatedByUsers(inspection)[0] || createdBy
  let [isVisible, setIsVisible] = useState(false)

  const toggleMetaVisible = useCallback(() => {
    setIsVisible((currentVal) => !currentVal)
  }, [])

  return (
    <InspectionMetaView className={className}>
      <InputLabel style={{ justifyContent: 'start', alignItems: 'center', paddingBottom: 0 }}>
        Tarkastuksen tiedot
        <TextButton
          style={{ display: 'inline-block', marginLeft: '1rem' }}
          onClick={toggleMetaVisible}>
          {isVisible ? text('hide') : text('show')}
        </TextButton>
      </InputLabel>
      {isVisible && (
        <InspectionMetaContainer>
          <MetaDisplay>
            <MetaItem>
              <MetaLabel>Perustettu</MetaLabel>
              <MetaValue>
                {format(parseISO(inspection.createdAt), READABLE_TIME_FORMAT)}
              </MetaValue>
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
              <MetaValue>
                {format(parseISO(inspection.updatedAt), READABLE_TIME_FORMAT)}
              </MetaValue>
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
        </InspectionMetaContainer>
      )}
    </InspectionMetaView>
  )
})

export default InspectionMeta
