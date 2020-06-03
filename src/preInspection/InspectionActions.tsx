import React, { CSSProperties, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionStatus, InspectionType } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import {
  useEditInspection,
  usePreInspectionReports,
  useRemoveInspection,
} from './inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import { publishInspectionMutation, rejectInspectionMutation } from './preInspectionQueries'
import { useStateValue } from '../state/useAppState'
import { useMatch } from '@reach/router'
import { requireAdminUser } from '../util/userRoles'

const ButtonRow = styled.div`
  margin: auto -1rem 0;
  padding: 0.75rem 1rem 0.75rem;
  border-top: 1px solid var(--lighter-grey);
  background: var(--white-grey);
  display: flex;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  > * {
    margin-right: 1rem;
  }
`

export type PropTypes = {
  inspection: Inspection
  onRefresh: () => unknown
  draftActions?: React.ReactChild
  reviewActions?: React.ReactChild
  productionActions?: React.ReactChild
  className?: string
  style?: CSSProperties
}

const InspectionActions = observer(
  ({
    inspection,
    onRefresh,
    draftActions,
    reviewActions,
    productionActions,
    className,
    style,
  }: PropTypes) => {
    var [user] = useStateValue('user')
    var isEditing = useMatch(`edit/${inspection.id}`)

    console.log(isEditing)

    var editInspection = useEditInspection(InspectionType.Pre)
    var goToPreInspectionReports = usePreInspectionReports()

    var [removePreInspection, { loading: removeLoading }] = useRemoveInspection(onRefresh)

    var [publishPreInspection] = useMutationData(publishInspectionMutation)
    var [rejectPreInspection] = useMutationData(rejectInspectionMutation)

    var onPublishInspection = useCallback(async () => {
      await publishPreInspection({
        variables: {
          inspectionId: inspection.id,
        },
      })

      await onRefresh()
    }, [onRefresh, inspection])

    var onRejectInspection = useCallback(async () => {
      await rejectPreInspection({
        variables: {
          inspectionId: inspection.id,
        },
      })

      await onRefresh()
    }, [onRefresh, inspection])

    let userCanPublish =
      inspection.status === InspectionStatus.InReview && requireAdminUser(user)

    return (
      <ButtonRow className={className} style={style}>
        {!isEditing && (
          <Button
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.MEDIUM}
            onClick={() => editInspection(inspection)}>
            {inspection.status === InspectionStatus.Draft ? 'Muokkaa' : 'Avaa'}
          </Button>
        )}
        {inspection.status === InspectionStatus.Draft && requireAdminUser(user) && (
          <Button
            style={{ marginLeft: 'auto', marginRight: 0 }}
            loading={removeLoading}
            buttonStyle={ButtonStyle.REMOVE}
            size={ButtonSize.MEDIUM}
            onClick={() => removePreInspection(inspection)}>
            Poista
          </Button>
        )}
        {inspection.status === InspectionStatus.InReview && userCanPublish && (
          <>
            <Button
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              onClick={onPublishInspection}>
              Julkaise
            </Button>
            <Button
              buttonStyle={ButtonStyle.REMOVE}
              size={ButtonSize.MEDIUM}
              onClick={onRejectInspection}>
              Hylkää
            </Button>
          </>
        )}
        {inspection.status !== InspectionStatus.Draft && (
          <Button
            onClick={() => goToPreInspectionReports(inspection.id)}
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.MEDIUM}>
            Raportit
          </Button>
        )}
      </ButtonRow>
    )
  }
)

export default InspectionActions
