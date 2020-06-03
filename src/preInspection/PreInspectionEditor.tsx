import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionInput } from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import { useMutationData } from '../util/useMutationData'
import { updateInspectionMutation } from './preInspectionQueries'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { useStateValue } from '../state/useAppState'
import PreInspectionMeta from './PreInspectionMeta'
import PreInspectionConfig from './PreInspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { PreInspectionContext } from './PreInspectionContext'
import { navigateWithQueryString } from '../util/urlValue'
import { SectionHeading } from '../common/components/Typography'
import PreInspectionExecutionRequirements from '../executionRequirement/PreInspectionExecutionRequirements'
import { PageSection } from '../common/components/common'
import PreInspectionDevTools from '../dev/PreInspectionDevTools'
import InspectionActions from './InspectionActions'

const EditPreInspectionView = styled.div`
  width: 100%;
  padding: 0 1.25rem;
`

type PreInspectionProps = {
  refetchData: () => unknown
  loading?: boolean
} & TabChildProps

const PreInspectionEditor: React.FC<PreInspectionProps> = observer(
  ({ refetchData, loading }) => {
    var inspection = useContext(PreInspectionContext)

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
        if (!isUpdating.current && inspection && !loading) {
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
      (name) => (value) => updatePreInspectionValue(name, value),
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
        {!!inspection && (
          <>
            <InspectionActions inspection={inspection} onRefresh={refetchData} />
            <PreInspectionMeta isLoading={isLoading} />

            <SectionHeading theme="light">Perustiedot</SectionHeading>
            <PreInspectionConfig onUpdateValue={createUpdateCallback} />

            <SectionHeading theme="light">Lähtöketjut</SectionHeading>
            <DepartureBlocks />

            <SectionHeading theme="light">Suoritevaatimus</SectionHeading>
            <PreInspectionExecutionRequirements />

            <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
            <ProcurementUnits />

            <PageSection>
              <PreInspectionDevTools inspection={inspection} />
            </PageSection>
          </>
        )}
      </EditPreInspectionView>
    )
  }
)

export default PreInspectionEditor
