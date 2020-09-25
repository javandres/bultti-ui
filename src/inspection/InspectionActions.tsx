import React, { CSSProperties, useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionStatus, InspectionType, Season } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import {
  useEditInspection,
  useInspectionReports,
  useRemoveInspection,
} from './inspectionUtils'
import { useMutationData } from '../util/useMutationData'
import {
  publishInspectionMutation,
  rejectInspectionMutation,
  submitInspectionMutation,
} from './inspectionQueries'
import { useStateValue } from '../state/useAppState'
import { useMatch } from '@reach/router'
import { requireAdminUser, requireOperatorUser } from '../util/userRoles'
import InspectionApprovalSubmit from './InspectionApprovalSubmit'

const ButtonRow = styled.div`
  margin: auto -1rem 0;
  padding: 0.75rem 1rem 0.75rem;
  border-top: 1px solid var(--lighter-grey);
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
  inspectionType: InspectionType
  onRefresh: () => unknown
  className?: string
  style?: CSSProperties
  disabledActions?: Actions[]
}

const InspectionActions = observer(
  ({
    inspection,
    inspectionType,
    onRefresh,
    className,
    style,
    disabledActions = [],
  }: PropTypes) => {
    var [season, setSeason] = useStateValue<Season>('globalSeason')
    var [user] = useStateValue('user')
    var [submitActive, setSubmitActive] = useState(false)

    var isEditing = useMatch(`/:inspectionType/edit/:inspectionId/*`)

    var goToInspectionEdit = useEditInspection(inspectionType)
    var goToInspectionReports = useInspectionReports()

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

    var [submitInspection, { loading: submitLoading }] = useMutationData(
      submitInspectionMutation
    )

    var [publishInspection, { loading: publishLoading }] = useMutationData(
      publishInspectionMutation
    )

    var [rejectInspection, { loading: rejectLoading }] = useMutationData(
      rejectInspectionMutation
    )

    var onSubmitProcessStart = useCallback(() => {
      setSubmitActive(true)
    }, [])

    var onCancelSubmit = useCallback(() => {
      setSubmitActive(false)
    }, [])

    var onSubmitInspection = useCallback(
      async (startDate: string, endDate: string) => {
        if (disabledActions.includes('submit')) {
          return
        }

        await submitInspection({
          variables: {
            inspectionId: inspection.id,
            startDate,
            endDate,
          },
        })

        await onRefresh()
      },
      [onRefresh, inspection, disabledActions]
    )

    var onPublishInspection = useCallback(async () => {
      if (disabledActions.includes('publish')) {
        return
      }

      await publishInspection({
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

      await rejectInspection({
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
            style={
              inspection.status === InspectionStatus.InProduction
                ? { marginLeft: 'auto', marginRight: 0 }
                : undefined
            }
            onClick={() => goToInspectionReports(inspection.id, inspectionType)}
            buttonStyle={
              inspection.status === InspectionStatus.InProduction
                ? ButtonStyle.NORMAL
                : ButtonStyle.SECONDARY
            }
            size={ButtonSize.MEDIUM}>
            Raportit
          </Button>
        )}
        {inspection.status === InspectionStatus.Draft &&
          requireOperatorUser(user, inspection?.operatorId || undefined) &&
          isEditing && (
            <>
              <Button
                disabled={false /*disabledActions.includes('submit')*/}
                loading={submitLoading}
                buttonStyle={ButtonStyle.NORMAL}
                size={ButtonSize.MEDIUM}
                onClick={onSubmitProcessStart}>
                Lähetä hyväksyttäväksi
              </Button>
              {submitActive && (
                <InspectionApprovalSubmit
                  inspection={inspection}
                  onSubmit={onSubmitInspection}
                  onCancel={onCancelSubmit}
                />
              )}
            </>
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
