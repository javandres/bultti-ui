import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionInput, InspectionStatus } from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import { useMutationData } from '../util/useMutationData'
import { updateInspectionMutation } from './preInspectionQueries'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { useStateValue } from '../state/useAppState'
import PreInspectionMeta from './PreInspectionMeta'
import PreInspectionConfig from './PreInspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { InspectionContext } from '../inspection/InspectionContext'
import { navigateWithQueryString } from '../util/urlValue'
import { SectionHeading } from '../common/components/Typography'
import PreInspectionExecutionRequirements from '../executionRequirement/PreInspectionExecutionRequirements'
import { PageSection } from '../common/components/common'
import PreInspectionDevTools from '../dev/PreInspectionDevTools'
import { LoadingDisplay } from '../common/components/Loading'
import InspectionUsers from './InspectionUsers'

const EditPreInspectionView = styled.div`
  width: 100%;
  padding: 0 0.75rem;
`

type PreInspectionProps = {
  refetchData: () => unknown
  loading?: boolean
} & TabChildProps

const PreInspectionEditor: React.FC<PreInspectionProps> = observer(
  ({ refetchData, loading }) => {
    var inspection = useContext(InspectionContext)
    var isEditable = inspection?.status === InspectionStatus.Draft

    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')

    let isUpdating = useRef(false)

    let [updatePreInspection, { loading: updateLoading }] = useMutationData(
      updateInspectionMutation
    )

    let isLoading = useMemo(() => loading || updateLoading, [loading, updateLoading])

    // Update the pre-inspection on changes
    var updatePreInspectionValue = useCallback(
      async (name: keyof InspectionInput, value: string) => {
        if (isEditable && !isUpdating.current && inspection && !loading) {
          isUpdating.current = true

          var inspectionInput: InspectionInput = {}
          inspectionInput[name] = value

          await updatePreInspection({
            variables: {
              inspectionId: inspection.id,
              inspectionInput,
            },
          })

          isUpdating.current = false
          await refetchData()
        }
      },
      [isUpdating.current, inspection, loading, updatePreInspection, refetchData]
    )

    let createUpdateCallback = useCallback(
      (name) => (value) => (isEditable ? updatePreInspectionValue(name, value) : () => {}),
      [updatePreInspectionValue]
    )

    useEffect(() => {
      if (!inspection || !operator || !season) {
        return
      }

      if (inspection.operatorId !== operator.operatorId || inspection.seasonId !== season.id) {
        navigateWithQueryString(`/pre-inspection/edit`)
      }
    }, [inspection, operator, season])

    return (
      <EditPreInspectionView>
        <LoadingDisplay loading={isLoading} />
        {!!inspection && (
          <>
            <PreInspectionMeta />
            <InspectionUsers />
            <PreInspectionConfig
              isEditable={isEditable}
              onUpdateValue={createUpdateCallback}
            />
            <DepartureBlocks onUpdate={refetchData} isEditable={isEditable} />
            <PreInspectionExecutionRequirements />
            <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
            <ProcurementUnits onUpdate={refetchData} requirementsEditable={isEditable} />

            <PageSection>
              <PreInspectionDevTools onUpdate={refetchData} inspection={inspection} />
            </PageSection>
          </>
        )}
      </EditPreInspectionView>
    )
  }
)

export default PreInspectionEditor
