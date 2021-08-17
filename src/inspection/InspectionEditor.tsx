import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import {
  Inspection,
  InspectionInput,
  InspectionStatus,
  InspectionType,
  PostInspection,
  PreInspection,
} from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { inspectionQuery, updateInspectionMutation } from './inspectionQueries'
import { useStateValue } from '../state/useAppState'
import InspectionMeta from './InspectionMeta'
import InspectionConfig from './InspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { LoadingDisplay } from '../common/components/Loading'
import InspectionUsers from './InspectionUsers'
import InspectionValidationErrors from './InspectionValidationErrors'
import { didInspectionPeriodChange, getInspectionTypeStrings } from './inspectionUtils'
import { operatorIsValid } from '../common/input/SelectOperator'
import { seasonIsValid } from '../common/input/SelectSeason'
import PreInspectionEditor from '../preInspection/PreInspectionEditor'
import PostInspectionEditor from '../postInspection/PostInspectionEditor'
import { useNavigate } from '../util/urlValue'
import { departureBlocksQuery } from '../departureBlock/departureBlocksQuery'
import { pickGraphqlData } from '../util/pickGraphqlData'

const EditInspectionView = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1rem 0.75rem 2rem;
  background-color: var(--white-grey);
`

type InspectionEditorProps = {
  refetchData: () => unknown
  loading?: boolean
  inspection: Inspection
} & TabChildProps

const InspectionEditor: React.FC<InspectionEditorProps> = observer(
  ({ refetchData, loading, inspection }) => {
    var isEditable = inspection?.status === InspectionStatus.Draft

    var [globalSeason] = useStateValue('globalSeason')
    var [globalOperator] = useStateValue('globalOperator')

    let isUpdating = useRef(false)
    let inspectionType = inspection.inspectionType

    let [updatePreInspection, { loading: updateLoading }] = useMutationData(
      updateInspectionMutation,
      {
        refetchQueries: [
          {
            query: inspectionQuery,
            variables: { inspectionId: inspection?.id || '' },
          },
        ],
        update: (cache, mutationResult) => {
          if (didInspectionPeriodChange(pickGraphqlData(mutationResult.data), inspection)) {
            cache.writeQuery({
              query: departureBlocksQuery,
              variables: { inspectionId: inspection.id },
              data: {
                inspectionDepartureBlocks: [],
              },
            })
          }
        },
      }
    )

    let isLoading = useMemo(() => loading || updateLoading, [loading, updateLoading])

    let updatePreInspectionCb = useCallback(
      async (updatedValues: InspectionInput = {}) => {
        isUpdating.current = true

        await updatePreInspection({
          variables: {
            inspectionId: inspection.id,
            inspectionInput: updatedValues,
          },
        })

        isUpdating.current = false
        await refetchData()
      },
      [isUpdating.current, inspection, updatePreInspection, refetchData]
    )

    let navigate = useNavigate()

    useEffect(() => {
      if (!inspection || !operatorIsValid(globalOperator) || !seasonIsValid(globalSeason)) {
        return
      }

      if (
        inspection.operatorId !== globalOperator.id ||
        inspection.seasonId !== globalSeason.id
      ) {
        navigate.push(
          `/${getInspectionTypeStrings(inspection.inspectionType).path}-inspection/edit`
        )
      }
    }, [inspection, globalOperator, globalSeason, navigate])

    let hasErrors = inspection?.inspectionErrors?.length !== 0

    return (
      <EditInspectionView>
        <LoadingDisplay loading={isLoading} />
        {hasErrors && <InspectionValidationErrors inspection={inspection} />}
        {!!inspection && (
          <>
            <InspectionMeta inspection={inspection} />
            <InspectionUsers inspection={inspection} />
            <InspectionConfig inspection={inspection} saveValues={updatePreInspectionCb} />
            {inspectionType === InspectionType.Pre ? (
              <PreInspectionEditor
                inspection={inspection as PreInspection}
                isEditable={isEditable}
                refetchData={refetchData}
              />
            ) : inspectionType === InspectionType.Post ? (
              <PostInspectionEditor
                inspection={inspection as PostInspection}
                isEditable={isEditable}
                refetchData={refetchData}
              />
            ) : null}
          </>
        )}
      </EditInspectionView>
    )
  }
)

export default InspectionEditor
