import React, { useCallback } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionEditor from '../preInspection/PreInspectionEditor'
import { MessageContainer, MessageView, Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import { PreInspection } from '../schema-types'
import PreviewPreInspection from '../preInspection/PreviewPreInspection'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useMutationData } from '../util/useMutationData'
import {
  preInspectionQuery,
  publishPreInspectionMutation,
} from '../preInspection/preInspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { useStateValue } from '../state/useAppState'
import { useEditPreInspection } from '../preInspection/preInspectionUtils'

const EditPreInspectionView = styled(Page)``

export type PropTypes = {
  preInspectionId?: string
} & RouteComponentProps

const EditPreInspection: React.FC<PropTypes> = observer(({ preInspectionId = '' }) => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')
  var editPreInspection = useEditPreInspection()

  let { data: preInspection, loading: inspectionLoading, refetch } = useQueryData<PreInspection>(
    preInspectionQuery,
    {
      skip: !preInspectionId,
      notifyOnNetworkStatusChange: true,
      variables: {
        preInspectionId: preInspectionId,
      },
    }
  )

  let [publishPreInspection] = useMutationData(publishPreInspectionMutation)

  let onPublish = useCallback(
    async (publishId: string) => {
      await publishPreInspection({
        variables: {
          preInspectionId: publishId,
        },
      })

      await refetch()
      editPreInspection()
    },
    [publishPreInspection, refetch, editPreInspection]
  )

  return (
    <EditPreInspectionView>
      <PreInspectionContext.Provider value={preInspection || null}>
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
        {!preInspection || !operator || !season ? (
          <MessageContainer>
            <MessageView>Valitse liikennöitsijä ja kausi.</MessageView>
          </MessageContainer>
        ) : (
          <Tabs>
            <PreInspectionEditor
              name="new"
              path="/"
              label="Luo"
              loading={inspectionLoading}
              refetchData={refetch}
            />
            <PreviewPreInspection
              path="preview"
              name="preview"
              label="Esikatsele"
              publishPreInspection={onPublish}
            />
          </Tabs>
        )}
      </PreInspectionContext.Provider>
    </EditPreInspectionView>
  )
})

export default EditPreInspection
