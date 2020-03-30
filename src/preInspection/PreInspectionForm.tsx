import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ErrorView, MessageContainer, SectionHeading } from '../common/components/common'
import {
  InitialPreInspectionInput,
  InspectionStatus,
  Operator,
  PreInspection,
  PreInspectionInput,
  Season,
} from '../schema-types'
import { PageLoading } from '../common/components/Loading'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import { useMutationData } from '../util/useMutationData'
import {
  createPreInspectionMutation,
  preInspectionQuery,
  updatePreInspectionMutation,
} from './preInspectionQueries'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { useStateValue } from '../state/useAppState'
import { useQueryData } from '../util/useQueryData'
import { FormColumn, FormWrapper, TransparentFormWrapper } from '../common/components/form'
import PreInspectionMeta from './PreInspectionMeta'
import PreInspectionConfig from './PreInspectionConfig'
import ExecutionRequirements from '../executionRequirement/ExecutionRequirements'

const CreatePreInspectionFormView = styled.div`
  width: 100%;
`

type PreInspectionProps = {}

function isOperator(value: any): value is Operator {
  return typeof value?.operatorName !== 'undefined' && typeof value?.id === 'number'
}

function isSeason(value: any): value is Season {
  return typeof value?.season !== 'undefined' && typeof value?.startDate !== 'undefined'
}

export const PreInspectionContext = React.createContext<PreInspection | null>(null)

const PreInspectionForm: React.FC<PreInspectionProps> = observer(() => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let isUpdating = useRef(false)

  let { data: preInspection, loading: inspectionLoading, refetch } = useQueryData(
    preInspectionQuery,
    {
      skip: !operator || !season,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.id,
        seasonId: season?.id,
      },
    }
  )

  let [createPreInspection, { loading: createLoading }] = useMutationData(
    createPreInspectionMutation
  )

  let [updatePreInspection, { loading: updateLoading }] = useMutationData(
    updatePreInspectionMutation
  )

  let isLoading = useMemo(() => inspectionLoading || createLoading || updateLoading, [
    inspectionLoading,
    createLoading,
    updateLoading,
  ])

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  useEffect(() => {
    // A pre-inspection can be created when there is not one currently existing or loading
    if (!isUpdating.current && !preInspection && operator && season && !inspectionLoading) {
      isUpdating.current = true

      // InitialPreInspectionInput requires operator and season ID.
      let preInspectionInput: InitialPreInspectionInput = {
        operatorId: operator.id,
        seasonId: season.id,
        startDate: season.startDate,
        endDate: season.endDate,
        status: InspectionStatus.Draft,
      }

      createPreInspection({
        variables: {
          preInspectionInput,
        },
      }).then(() => {
        isUpdating.current = false
        refetch()
      })
    }
  }, [isUpdating.current, preInspection, season, operator, inspectionLoading])

  // Update the pre-inspection on changes
  var updatePreInspectionValue = useCallback(
    async (name: keyof PreInspectionInput, value: string | Operator | Season) => {
      if (!isUpdating.current && preInspection && !inspectionLoading) {
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
        refetch()
      }
    },
    [isUpdating.current, preInspection, inspectionLoading, updatePreInspection]
  )

  let createUpdateCallback = useCallback(
    (name) => (value) => updatePreInspectionValue(name, value),
    [updatePreInspectionValue]
  )

  useEffect(() => {
    if (preInspection) {
      if (!preInspection.operator || preInspection.operator.id !== operator.id) {
        updatePreInspectionValue('operatorId', operator)
      }

      if (!preInspection.season || preInspection.season.id !== season.id) {
        updatePreInspectionValue('seasonId', season)
      }
    }
  }, [operator, season, preInspection])

  // Validate that the form has each dependent piece of data.
  let formCondition = useMemo(() => {
    return {
      preInspection: !!preInspection,
      status: preInspection?.status === InspectionStatus.Draft,
      operator: !!preInspection?.operator,
      startDate: !!preInspection?.startDate,
      season: !!preInspection?.season,
    }
  }, [preInspection])

  // Validation issues that affect the form at this moment
  let activeBlockers = Object.entries(formCondition)
    .filter(([, status]) => !status)
    .map(([key]) => key)

  let onPublish = useCallback(() => {
    updatePreInspectionValue('status', InspectionStatus.InProduction)
  }, [updatePreInspectionValue])

  return (
    <CreatePreInspectionFormView>
      {activeBlockers.length !== 0 && (
        <MessageContainer style={{ marginBottom: '1rem' }}>
          {activeBlockers.map((blockerName) => (
            <ErrorView key={blockerName}>{blockerName}</ErrorView>
          ))}
        </MessageContainer>
      )}
      {inspectionLoading ? (
        <PageLoading />
      ) : (
        <PreInspectionContext.Provider value={preInspection}>
          <PreInspectionMeta isLoading={isLoading} onClickPublish={onPublish} />

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
              <ExecutionRequirements />
            </FormColumn>
          </FormWrapper>

          <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
          <TransparentFormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <ProcurementUnits />
            </FormColumn>
          </TransparentFormWrapper>
        </PreInspectionContext.Provider>
      )}
    </CreatePreInspectionFormView>
  )
})

export default PreInspectionForm
