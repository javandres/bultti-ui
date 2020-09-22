import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionInput, InspectionStatus } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { useStateValue } from '../state/useAppState'
import InspectionMeta from '../inspection/InspectionMeta'
import PostInspectionConfig from './PostInspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { InspectionContext } from '../inspection/InspectionContext'
import { navigateWithQueryString } from '../util/urlValue'
import { LoadingDisplay } from '../common/components/Loading'
import InspectionUsers from '../inspection/InspectionUsers'
import { updateInspectionMutation } from '../inspection/inspectionQueries'

const EditPostInspectionView = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 0 0.75rem;
  background-color: var(--white-grey);
`

type PostInspectionProps = {
  refetchData: () => unknown
  loading?: boolean
} & TabChildProps

const PostInspectionEditor: React.FC<PostInspectionProps> = observer(
  ({ refetchData, loading }) => {
    var inspection = useContext(InspectionContext)
    var isEditable = inspection?.status === InspectionStatus.Draft

    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')

    let isUpdating = useRef(false)

    let [updatePostInspection, { loading: updateLoading }] = useMutationData(
      updateInspectionMutation
    )

    let isLoading = useMemo(() => loading || updateLoading, [loading, updateLoading])

    // Update the post-inspection on changes
    var updatePostInspectionValue = useCallback(
      async (name: keyof InspectionInput, value: string) => {
        if (isEditable && !isUpdating.current && inspection && !loading) {
          isUpdating.current = true

          var inspectionInput: InspectionInput = {}
          inspectionInput[name] = value

          await updatePostInspection({
            variables: {
              inspectionId: inspection.id,
              inspectionInput,
            },
          })

          isUpdating.current = false
          await refetchData()
        }
      },
      [isUpdating.current, inspection, loading, updatePostInspection, refetchData]
    )

    let createUpdateCallback = useCallback(
      (name) => (value) => (isEditable ? updatePostInspectionValue(name, value) : () => {}),
      [updatePostInspectionValue]
    )

    useEffect(() => {
      if (!inspection || !operator || !season) {
        return
      }

      if (inspection.operatorId !== operator.operatorId || inspection.seasonId !== season.id) {
        navigateWithQueryString(`/post-inspection/edit`)
      }
    }, [inspection, operator, season])

    return (
      <EditPostInspectionView>
        <LoadingDisplay loading={isLoading} />
        {!!inspection && (
          <>
            <InspectionMeta inspection={inspection} />
            <InspectionUsers />
            <PostInspectionConfig
              isEditable={isEditable}
              onUpdateValue={createUpdateCallback}
            />
          </>
        )}
      </EditPostInspectionView>
    )
  }
)

export default PostInspectionEditor
