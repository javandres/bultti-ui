import React, { CSSProperties, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionStatus, UserRole } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { usePreInspectionReports, useRemovePreInspection } from './preInspectionUtils'
import { useMutationData } from '../util/useMutationData'
import { publishInspectionMutation, rejectInspectionMutation } from './preInspectionQueries'
import { useStateValue } from '../state/useAppState'

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
  onSelect: (value: Inspection | null) => unknown
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
    onSelect,
    draftActions,
    reviewActions,
    productionActions,
    className,
    style,
  }: PropTypes) => {
    var [user] = useStateValue('user')

    let [removePreInspection, { loading: removeLoading }] = useRemovePreInspection(onRefresh)

    let goToPreInspectionReports = usePreInspectionReports()

    let [publishPreInspection] = useMutationData(publishInspectionMutation)
    let [rejectPreInspection] = useMutationData(rejectInspectionMutation)

    let inspectionAction = useCallback(
      async (action, inspectionId: string) => {
        await action({
          variables: {
            inspectionId,
          },
        })

        await onRefresh()
      },
      [onRefresh]
    )

    let userCanPublish =
      inspection.status === InspectionStatus.InReview && user && user.role === UserRole.Admin

    return (
      <ButtonRow className={className} style={style}>
        {inspection.status === InspectionStatus.Draft ? (
          <>
            <Button
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              onClick={() => onSelect(inspection)}>
              Muokkaa
            </Button>
            <Button
              style={{ marginLeft: 'auto', marginRight: 0 }}
              loading={removeLoading}
              buttonStyle={ButtonStyle.REMOVE}
              size={ButtonSize.MEDIUM}
              onClick={() => removePreInspection(inspection)}>
              Poista
            </Button>
            {draftActions}
          </>
        ) : inspection.status === InspectionStatus.InReview ? (
          <>
            {userCanPublish && (
              <>
                <Button
                  buttonStyle={ButtonStyle.NORMAL}
                  size={ButtonSize.MEDIUM}
                  onClick={() => inspectionAction(publishPreInspection, inspection.id)}>
                  Julkaise
                </Button>
                <Button
                  buttonStyle={ButtonStyle.REMOVE}
                  size={ButtonSize.MEDIUM}
                  onClick={() => inspectionAction(rejectPreInspection, inspection.id)}>
                  Hylkää
                </Button>
              </>
            )}
            <Button
              onClick={() => goToPreInspectionReports(inspection.id)}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}>
              Raportit
            </Button>
            {reviewActions}
          </>
        ) : inspection.status === InspectionStatus.InProduction ? (
          <>
            <Button
              onClick={() => goToPreInspectionReports(inspection.id)}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}>
              Raportit
            </Button>
            {productionActions}
          </>
        ) : null}
      </ButtonRow>
    )
  }
)

export default InspectionActions
