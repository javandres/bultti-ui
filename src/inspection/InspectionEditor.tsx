import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionInput, InspectionStatus, InspectionType } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { inspectionQuery, updateInspectionMutation } from './inspectionQueries'
import { useStateValue } from '../state/useAppState'
import InspectionMeta from './InspectionMeta'
import InspectionConfig from './InspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { navigateWithQueryString } from '../util/urlValue'
import { LoadingDisplay } from '../common/components/Loading'
import InspectionUsers from './InspectionUsers'
import PostInspectionEditor from '../postInspection/PostInspectionEditor'
import PreInspectionEditor from '../preInspection/PreInspectionEditor'
import { pick } from 'lodash'
import InspectionValidationErrors from './InspectionValidationErrors'

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

    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')

    let isUpdating = useRef(false)

    let [updatePreInspection, { loading: updateLoading }] = useMutationData(
      updateInspectionMutation,
      {
        refetchQueries: [
          { query: inspectionQuery, variables: { inspectionId: inspection?.id || '' } },
        ],
      }
    )

    let isLoading = useMemo(() => loading || updateLoading, [loading, updateLoading])

    // Update the pre-inspection on changes
    var updatePreInspectionValues = useCallback(
      async (updatedValues: InspectionInput = {}) => {
        if (Object.keys(updatedValues).length === 0) {
          return
        }

        let updateValues = updatedValues

        if (!isEditable) {
          updatedValues = pick(updateValues, 'name')
        }

        if (
          Object.keys(updateValues).length !== 0 &&
          !isUpdating.current &&
          inspection &&
          !loading
        ) {
          isUpdating.current = true

          await updatePreInspection({
            variables: {
              inspectionId: inspection.id,
              inspectionInput: updatedValues,
            },
          })

          isUpdating.current = false
          await refetchData()
        }
      },
      [isUpdating.current, inspection, loading, updatePreInspection, refetchData]
    )

    let createUpdateCallback = useCallback(
      (updatedValues: InspectionInput) => updatePreInspectionValues(updatedValues),
      [updatePreInspectionValues]
    )

    useEffect(() => {
      if (!inspection || !operator || !season) {
        return
      }

      if (inspection.operatorId !== operator.operatorId || inspection.seasonId !== season.id) {
        navigateWithQueryString(`/pre-inspection/edit`)
      }
    }, [inspection, operator, season])

    let InspectionTypeEditor = useMemo(() => {
      if (inspection.inspectionType === InspectionType.Pre) {
        return PreInspectionEditor
      }

      if (inspection.inspectionType === InspectionType.Post) {
        return PostInspectionEditor
      }

      return React.Fragment
    }, [inspection])

    let hasErrors = inspection?.inspectionErrors?.length !== 0

    return (
      <EditInspectionView>
        <LoadingDisplay loading={isLoading} />
        {hasErrors && <InspectionValidationErrors inspection={inspection} />}
        {!!inspection && (
          <>
            <InspectionMeta inspection={inspection} />
            <InspectionUsers inspection={inspection} />
            <InspectionConfig
              inspection={inspection}
              isEditable={isEditable}
              saveValues={createUpdateCallback}
            />
            <InspectionTypeEditor
              inspection={inspection}
              isEditable={isEditable}
              refetchData={refetchData}
            />
          </>
        )}
      </EditInspectionView>
    )
  }
)

export default InspectionEditor
