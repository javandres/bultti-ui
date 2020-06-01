import React, { useCallback } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionEditor from '../preInspection/PreInspectionEditor'
import { Page } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import PreInspectionPreview from '../preInspection/PreInspectionPreview'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import {
  publishPreInspectionMutation,
  submitPreInspectionMutation,
} from '../preInspection/preInspectionQueries'
import { useStateValue } from '../state/useAppState'
import {
  useEditPreInspection,
  usePreInspectionById,
} from '../preInspection/preInspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { PageTitle } from '../common/components/Typography'
import { InspectionStatus, UserRole } from '../schema-types'
import { useRefetch } from '../util/useRefetch'

const EditPreInspectionView = styled(Page)``

export type PropTypes = {
  inspectionId?: string
} & RouteComponentProps

const EditPreInspectionPage: React.FC<PropTypes> = observer(({ inspectionId = '' }) => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')
  var [user] = useStateValue('user')
  var editPreInspection = useEditPreInspection()

  let {
    data: inspection,
    loading: inspectionLoading,
    refetch: refetchInspection,
  } = usePreInspectionById(inspectionId)

  let refetch = useRefetch(refetchInspection)

  let [publishPreInspection] = useMutationData(publishPreInspectionMutation)
  let [submitPreInspection] = useMutationData(submitPreInspectionMutation)

  let userCanPublish =
    inspection?.status === InspectionStatus.InReview && user && user.role === UserRole.Admin

  let inspectionAction = useCallback(
    async (publishId: string) => {
      let action = userCanPublish ? publishPreInspection : submitPreInspection

      await action({
        variables: {
          inspectionId: publishId,
        },
      })

      await refetch()
      editPreInspection()
    },
    [submitPreInspection, refetch, editPreInspection, userCanPublish]
  )

  return (
    <EditPreInspectionView>
      <PreInspectionContext.Provider value={inspection || null}>
        <PageTitle>
          Uusi ennakkotarkastus
          <Button
            style={{ marginLeft: 'auto' }}
            size={ButtonSize.MEDIUM}
            buttonStyle={ButtonStyle.SECONDARY_REMOVE}
            onClick={() => editPreInspection()}>
            Peruuta
          </Button>
        </PageTitle>
        {!operator || !season ? (
          <MessageContainer>
            <MessageView>Valitse liikennöitsijä ja kausi.</MessageView>
          </MessageContainer>
        ) : !inspection ? (
          <MessageContainer>
            <MessageView>Haettu ennakkotarkastus ei löytynyt.</MessageView>
            <Button onClick={() => editPreInspection()}>Takaisin</Button>
          </MessageContainer>
        ) : (
          <Tabs>
            <PreInspectionEditor
              name="create"
              path="/"
              label="Muokkaa"
              loading={inspectionLoading}
              refetchData={refetch}
            />
            <PreInspectionPreview
              path="preview"
              name="preview"
              label="Esikatsele"
              onInspectionAction={inspectionAction}
              inspectionActionLabel={userCanPublish ? 'Julkaise' : 'Valmis'}
            />
          </Tabs>
        )}
      </PreInspectionContext.Provider>
    </EditPreInspectionView>
  )
})

export default EditPreInspectionPage
