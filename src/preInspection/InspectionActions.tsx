import React, { CSSProperties, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionStatus, InspectionType, Season } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import {
  useEditInspection,
  usePreInspectionReports,
  useRemoveInspection,
} from '../inspection/inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import {
  publishInspectionMutation,
  rejectInspectionMutation,
  submitInspectionMutation,
} from './preInspectionQueries'
import { useStateValue } from '../state/useAppState'
import { useMatch } from '@reach/router'
import { requireAdminUser, requireOperatorUser } from '../util/userRoles'

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

  &:empty {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
  }
`

type Actions = 'publish' | 'reject' | 'submit' | 'remove'

export type PropTypes = {
  inspection: Inspection
  onRefresh: () => unknown
  className?: string
  style?: CSSProperties
  disabledActions?: Actions[]
}

const InspectionActions = observer(
  ({ inspection, onRefresh, className, style, disabledActions = [] }: PropTypes) => {
    var [season, setSeason] = useStateValue<Season>('globalSeason')
    var [user] = useStateValue('user')

    var isEditing = useMatch(`/:inspectionType/edit/:inspectionId/*`)

    var goToInspectionEdit = useEditInspection(InspectionType.Pre)
    var goToPreInspectionReports = usePreInspectionReports()

    var onEditInspection = useCallback(
      (inspection: Inspection) => {
        // If the season of the inspection is not already selected, ensure it is selected.
        if (inspection.seasonId !== season.id) {
          setSeason(inspection.season)
        }

        goToInspectionEdit(inspection)
      },
      [goToInspectionEdit, setSeason, season]
    )

    var [removePreInspection, { loading: removeLoading }] = useRemoveInspection(onRefresh)

    var [submitPreInspection, { loading: submitLoading }] = useMutationData(
      submitInspectionMutation
    )

    var [publishPreInspection, { loading: publishLoading }] = useMutationData(
      publishInspectionMutation
    )

    var [rejectPreInspection, { loading: rejectLoading }] = useMutationData(
      rejectInspectionMutation
    )

    var onSubmitInspection = useCallback(async () => {
      if (disabledActions.includes('submit')) {
        return
      }

      await submitPreInspection({
        variables: {
          inspectionId: inspection.id,
        },
      })

      await onRefresh()
    }, [onRefresh, inspection, disabledActions])

    var onPublishInspection = useCallback(async () => {
      if (disabledActions.includes('publish')) {
        return
      }

      await publishPreInspection({
        variables: {
          inspectionId: inspection.id,
        },
      })

      await onRefresh()
    }, [onRefresh, inspection, disabledActions])

    var onRejectInspection = useCallback(async () => {
      if (disabledActions.includes('reject')) {
        return
      }

      await rejectPreInspection({
        variables: {
          inspectionId: inspection.id,
        },
      })

      await onRefresh()
    }, [onRefresh, inspection, disabledActions])

    let userCanPublish =
      inspection.status === InspectionStatus.InReview && requireAdminUser(user)

    return (
      <ButtonRow className={className} style={style}>
        {!isEditing && (
          <Button
            buttonStyle={ButtonStyle.NORMAL}
            size={ButtonSize.MEDIUM}
            onClick={() => onEditInspection(inspection)}>
            {inspection.status === InspectionStatus.Draft ? 'Muokkaa' : 'Avaa'}
          </Button>
        )}
        {inspection.status !== InspectionStatus.Draft && (
          <Button
            onClick={() => goToPreInspectionReports(inspection.id)}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.MEDIUM}>
            Raportit
          </Button>
        )}
        {inspection.status === InspectionStatus.Draft &&
          requireOperatorUser(user, inspection?.operatorId || undefined) &&
          isEditing && (
            <Button
              disabled={disabledActions.includes('submit')}
              loading={submitLoading}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              onClick={onSubmitInspection}>
              Lähetä hyväksyttäväksi
            </Button>
          )}

        {inspection.status === InspectionStatus.Draft && requireAdminUser(user) && (
          <Button
            disabled={disabledActions.includes('remove')}
            style={{ marginLeft: 'auto', marginRight: 0 }}
            loading={removeLoading}
            buttonStyle={ButtonStyle.REMOVE}
            size={ButtonSize.MEDIUM}
            onClick={() => removePreInspection(inspection)}>
            Poista
          </Button>
        )}
        {inspection.status === InspectionStatus.InReview && userCanPublish && isEditing && (
          <>
            <Button
              disabled={disabledActions.includes('publish')}
              style={{ marginLeft: 'auto' }}
              loading={publishLoading}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              onClick={onPublishInspection}>
              Julkaise
            </Button>
            <Button
              disabled={disabledActions.includes('reject')}
              style={{ marginLeft: 'auto', marginRight: 0 }}
              loading={rejectLoading}
              buttonStyle={ButtonStyle.REMOVE}
              size={ButtonSize.MEDIUM}
              onClick={onRejectInspection}>
              Hylkää
            </Button>
          </>
        )}
      </ButtonRow>
    )
  }
)

export default InspectionActions
