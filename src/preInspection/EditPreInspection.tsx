import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ErrorView, MessageContainer, SectionHeading } from '../common/components/common'
import {
  InspectionStatus,
  Operator,
  PreInspection,
  PreInspectionInput,
  Season,
} from '../schema-types'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import { useMutationData } from '../util/useMutationData'
import { preInspectionQuery, updatePreInspectionMutation } from './preInspectionQueries'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { useStateValue } from '../state/useAppState'
import { FormColumn, FormWrapper, TransparentFormWrapper } from '../common/components/form'
import PreInspectionMeta from './PreInspectionMeta'
import PreInspectionConfig from './PreInspectionConfig'
import { TabChildProps } from '../common/components/Tabs'
import { useQueryData } from '../util/useQueryData'
import { PreInspectionContext } from './PreInspectionContext'
import { useNavigate } from '@reach/router'
import { ButtonStyle } from '../common/components/Button'

const EditPreInspectionView = styled.div`
  width: 100%;
`

type PreInspectionProps = {} & TabChildProps

function isOperator(value: any): value is Operator {
  return typeof value?.operatorName !== 'undefined' && typeof value?.id === 'number'
}

function isSeason(value: any): value is Season {
  return typeof value?.season !== 'undefined' && typeof value?.startDate !== 'undefined'
}

const EditPreInspection: React.FC<PreInspectionProps> = observer(() => {
  var navigate = useNavigate()
  var currentPreInspection = useContext(PreInspectionContext)

  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let isUpdating = useRef(false)

  let [updatePreInspection, { loading: updateLoading }] = useMutationData(
    updatePreInspectionMutation
  )

  let { data: preInspection, loading: inspectionLoading, refetch } = useQueryData<PreInspection>(
    preInspectionQuery,
    {
      skip: !currentPreInspection,
      notifyOnNetworkStatusChange: true,
      variables: {
        preInspectionId: currentPreInspection?.id,
      },
    }
  )

  let onPreInspectionChange = useCallback(() => {
    if (refetch) {
      refetch()
    }
  }, [refetch])

  let isLoading = useMemo(() => inspectionLoading || updateLoading, [
    inspectionLoading,
    updateLoading,
  ])

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
        await onPreInspectionChange()
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

  let onMetaButtonAction = useCallback(() => {
    navigate('create/preview')
  }, [navigate])

  return (
    <EditPreInspectionView>
      {activeBlockers.length !== 0 && (
        <MessageContainer style={{ marginBottom: '1rem' }}>
          {activeBlockers.map((blockerName) => (
            <ErrorView key={blockerName}>{blockerName}</ErrorView>
          ))}
        </MessageContainer>
      )}

      <PreInspectionMeta
        isLoading={isLoading}
        buttonStyle={ButtonStyle.SECONDARY}
        buttonAction={onMetaButtonAction}
        buttonLabel="Esikatsele"
      />

      <SectionHeading theme="light">Perustiedot</SectionHeading>
      <PreInspectionConfig onUpdateValue={createUpdateCallback} />

      {preInspection && (
        <>
          <SectionHeading theme="light">Lähtöketjut</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <DepartureBlocks />
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

export default EditPreInspection
