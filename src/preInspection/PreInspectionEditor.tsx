import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { SectionHeading } from '../common/components/common'
import { Operator, PreInspectionInput, Season } from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import { useMutationData } from '../util/useMutationData'
import { updatePreInspectionMutation } from './preInspectionQueries'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { useStateValue } from '../state/useAppState'
import { FormColumn, FormWrapper, TransparentFormWrapper } from '../common/components/form'
import PreInspectionMeta from './PreInspectionMeta'
import PreInspectionConfig from './PreInspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { PreInspectionContext } from './PreInspectionContext'
import { useNavigate } from '@reach/router'
import { ButtonStyle } from '../common/components/Button'
import PreInspectionExecutionRequirements from '../executionRequirement/PreInspectionExecutionRequirements'

const EditPreInspectionView = styled.div`
  width: 100%;
`

type PreInspectionProps = {
  refetchData?: () => unknown
  loading?: boolean
} & TabChildProps

function isOperator(value: any): value is Operator {
  return typeof value?.operatorName !== 'undefined' && typeof value?.id === 'number'
}

function isSeason(value: any): value is Season {
  return typeof value?.season !== 'undefined' && typeof value?.startDate !== 'undefined'
}

const PreInspectionEditor: React.FC<PreInspectionProps> = observer(({ refetchData, loading }) => {
  var navigate = useNavigate()
  var preInspection = useContext(PreInspectionContext)

  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let isUpdating = useRef(false)

  let [updatePreInspection, { loading: updateLoading }] = useMutationData(
    updatePreInspectionMutation
  )

  let onPreInspectionChange = useCallback(() => {
    if (refetchData) {
      refetchData()
    }
  }, [refetchData])

  let isLoading = useMemo(() => loading || updateLoading, [loading, updateLoading])

  // Update the pre-inspection on changes
  var updatePreInspectionValue = useCallback(
    async (name: keyof PreInspectionInput, value: string | Operator | Season) => {
      if (!isUpdating.current && preInspection && !loading) {
        isUpdating.current = true

        var preInspectionInput: PreInspectionInput = {}

        // If value is Operator or Season, ignore the prop name and set the value ID with the appropriate key.
        // If the season changed, also set the start and end dates from the new season.
        if (isOperator(value)) {
          preInspectionInput['operatorId'] = value.id
        } else if (isSeason(value)) {
          preInspectionInput['seasonId'] = value.id
          preInspectionInput['startDate'] = value.startDate
          preInspectionInput['endDate'] = value.endDate
        } else {
          preInspectionInput[name] = value
        }

        await updatePreInspection({
          variables: {
            preInspectionId: preInspection.id,
            preInspectionInput,
          },
        })

        isUpdating.current = false
        await onPreInspectionChange()
      }
    },
    [isUpdating.current, preInspection, loading, updatePreInspection]
  )

  let createUpdateCallback = useCallback(
    (name) => (value) => updatePreInspectionValue(name, value),
    [updatePreInspectionValue]
  )

  useEffect(() => {
    if (preInspection && operator && season) {
      if (!preInspection?.operator || preInspection?.operator?.id !== operator.id) {
        updatePreInspectionValue('operatorId', operator)
      }

      let seasonId = typeof season === 'string' ? season : season?.id

      if (!preInspection?.season || preInspection?.season?.id !== seasonId) {
        updatePreInspectionValue('seasonId', season) // Works with a string season
      }
    }
  }, [operator, season, preInspection])

  let onMetaButtonAction = useCallback(() => {
    if (preInspection) {
      navigate(`/pre-inspection/edit/${preInspection.id}/preview`)
    }
  }, [navigate, preInspection])

  return (
    <EditPreInspectionView>
      {!!preInspection && (
        <>
          <PreInspectionMeta
            isLoading={isLoading}
            buttonStyle={ButtonStyle.SECONDARY}
            buttonAction={onMetaButtonAction}
            buttonLabel="Esikatsele"
          />

          <SectionHeading theme="light">Perustiedot</SectionHeading>
          <PreInspectionConfig onUpdateValue={createUpdateCallback} />

          <SectionHeading theme="light">Lähtöketjut</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <DepartureBlocks />
            </FormColumn>
          </FormWrapper>

          <SectionHeading theme="light">Suoritevaatimus</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <PreInspectionExecutionRequirements />
            </FormColumn>
          </FormWrapper>

          <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
          <TransparentFormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <ProcurementUnits />
            </FormColumn>
          </TransparentFormWrapper>
        </>
      )}
    </EditPreInspectionView>
  )
})

export default PreInspectionEditor
