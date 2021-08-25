import React, { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { EquipmentDefect, EquipmentDefectPriority, PostInspection } from '../schema-types'
import { gql } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'
import { text, Text } from '../util/translate'
import { MessageContainer, SuccessView } from '../common/components/Messages'
import { FlexRow } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import PagedTable from '../common/table/PagedTable'
import { ValueOf } from '../type/common'
import { LoadingDisplay } from '../common/components/Loading'
import { TableRowWithDataAndFunctions } from '../common/table/tableUtils'
import { isAfter } from '../util/compare'
import { lowerCase } from 'lodash'

export type PropTypes = {
  inspection: PostInspection
}

const equipmentDefectPreviewQuery = gql`
  query equipmentDefectPreview($inspectionId: String!) {
    equipmentDefectObservations(inspectionId: $inspectionId) {
      id
      jolaId
      concludedDate
      deadlineDate
      description
      link
      name
      observationDate
      operatorId
      priority
      procurementUnitId
      registryNumber
      status
    }
  }
`

const equipmentDefectColumnLabels: { [key in keyof EquipmentDefect]?: string } = {
  name: 'Nimi',
  description: 'Kuvaus',
  procurementUnitId: 'Kilpailukohde',
  status: 'Tila',
  priority: 'Prioriteetti',
  registryNumber: 'Rekisterinumero',
  observationDate: 'Asetuspäivä',
  deadlineDate: 'Eräpäivä',
  concludedDate: 'Lopetuspäivä',
  link: 'JOLA linkki',
  jolaId: 'Jola ID',
}

const MATCH_AD_COVER_OBSERVATION_NAME = 'korin ulko'
const MATCH_AD_COVER_OBSERVATION_DESCRIPTION = 'mainosteippa'

const EquipmentDefectJolaRows: React.FC<PropTypes> = observer(({ inspection }) => {
  let { data = [], loading, refetch } = useQueryData<EquipmentDefect[]>(
    equipmentDefectPreviewQuery,
    {
      variables: {
        inspectionId: inspection.id,
      },
    }
  )

  // Refetch JOLA rows when the inspection period changes.
  useEffect(() => {
    refetch()
  }, [inspection.inspectionStartDate, inspection.inspectionEndDate, refetch])

  let renderJolaValue = useCallback(
    (key: keyof EquipmentDefect, value: ValueOf<EquipmentDefect>) => {
      if (key === 'priority') {
        return text(`jolaPriority_${value}`)
      }

      if (key === 'status') {
        return text(`jolaStatus_${value}`)
      }

      if (key === 'link') {
        return (
          <a target="_blank" href={value as string} rel="noreferrer">
            {value}
          </a>
        )
      }

      return value
    },
    []
  )

  let highlightRow = useCallback((row: TableRowWithDataAndFunctions<EquipmentDefect>) => {
    let { concludedDate, deadlineDate, priority, name, description } = row.item

    if (
      !concludedDate ||
      isAfter(concludedDate, deadlineDate) ||
      priority === EquipmentDefectPriority.Dangerous
    ) {
      return 'var(--light-red)'
    }

    // Ad cover defect case highlighted in yellow. These are not automatically sanctions.
    if (
      lowerCase(name).includes(MATCH_AD_COVER_OBSERVATION_NAME) &&
      lowerCase(description).includes(MATCH_AD_COVER_OBSERVATION_DESCRIPTION)
    ) {
      return 'var(--light-yellow)'
    }

    return ''
  }, [])

  return (
    <ExpandableSection
      style={{ position: 'relative' }}
      isExpanded={true}
      unmountOnClose={true}
      headerContent={
        <HeaderMainHeading>
          <Text>postInspection_jolaPreview_heading</Text>
        </HeaderMainHeading>
      }>
      <LoadingDisplay loading={loading} />
      <FlexRow style={{ marginBottom: '1rem', justifyContent: 'flex-end' }}>
        <Button
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          loading={loading}
          onClick={() => refetch()}>
          <Text>update</Text>
        </Button>
      </FlexRow>
      <p style={{ marginTop: 0, marginBottom: '1rem' }}>
        <Text>postInspection_jolaPreview_description</Text>
      </p>
      {data.length !== 0 ? (
        <PagedTable
          getRowHighlightColor={highlightRow}
          columnLabels={equipmentDefectColumnLabels}
          items={data || []}
          renderValue={renderJolaValue}
        />
      ) : !loading ? (
        <MessageContainer>
          <SuccessView>
            <Text>postInspection_jolaPreview_empty</Text>
          </SuccessView>
        </MessageContainer>
      ) : null}
    </ExpandableSection>
  )
})

export default EquipmentDefectJolaRows
