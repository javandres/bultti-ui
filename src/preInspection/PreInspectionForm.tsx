import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  Column,
  ColumnWrapper,
  ErrorView,
  InputLabel,
  MessageContainer,
  SectionHeading,
} from '../common/components/common'
import SelectOperator from '../common/input/SelectOperator'
import SelectSeason from '../common/input/SelectSeason'
import { InspectionStatus, Operator, PreInspectionInput, Season } from '../schema-types'
import SelectDate from '../common/input/SelectDate'
import { endOfISOWeek, format, parseISO, startOfISOWeek } from 'date-fns'
import { PageLoading } from '../common/components/Loading'
import Input from '../common/input/Input'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import ExecutionRequirements from '../executionRequirement/ExecutionRequirements'
import { useMutationData } from '../util/useMutationData'
import {
  createPreInspectionMutation,
  updatePreInspectionMutation,
} from './createPreInspectionMutation'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { DATE_FORMAT } from '../constants'
import { useStateValue } from '../state/useAppState'

const CreatePreInspectionFormView = styled.div`
  width: 100%;
`

const FormColumn = styled(Column)`
  padding: 1rem 0;
  margin-right: 1.5rem;

  &:last-child {
    margin-right: 0;
  }
`

const FormWrapper = styled(ColumnWrapper)`
  display: flex;
  padding: 0.5rem 1rem;
  margin: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
`

const TransparentFormWrapper = styled(FormWrapper)`
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;

  ${FormColumn}:first-child {
    padding-top: 0;
  }
`

const ControlGroup = styled.div`
  margin: 0 0 2rem;
  display: flex;
  flex-wrap: nowrap;

  &:last-child {
    margin-bottom: 0;
  }

  > * {
    flex: 1 1 50%;
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`

type PreInspectionProps = {}

function isOperator(value: any): value is Operator {
  return typeof value?.operatorName !== 'undefined' && typeof value?.id === 'number'
}

function isSeason(value: any): value is Season {
  return typeof value?.season !== 'undefined' && typeof value?.startDate !== 'undefined'
}

const PreInspectionForm: React.FC<PreInspectionProps> = observer(() => {
  var [season, setGlobalSeason] = useStateValue('globalSeason')
  var [operator, setGlobalOperator] = useStateValue('globalOperator')

  let [
    createPreInspection,
    { data: createdPreInspection, loading: inspectionLoading },
  ] = useMutationData(createPreInspectionMutation)

  let [
    updatePreInspection,
    { data: updatedPreInspection, loading: updateLoading },
  ] = useMutationData(updatePreInspectionMutation)

  let preInspection = useMemo(() => updatedPreInspection || createdPreInspection, [
    updatedPreInspection,
    createdPreInspection,
  ])

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  // TODO: Error views when status = invalid
  useEffect(() => {
    // A pre-inspection can be created when there is not one currently loading and the form state is uninitialized.
    if (!preInspection && operator && season && !inspectionLoading && !updateLoading) {
      let preInspectionInput: PreInspectionInput = {
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
      })
    }
  }, [preInspection, season, operator, updateLoading, inspectionLoading])

  let isUpdating = useRef(false)

  // Update the pre-inspection on changes
  var updatePreInspectionValue = useCallback(
    async (name: keyof PreInspectionInput, value: string | Operator | Season) => {
      if (!isUpdating.current && !updateLoading && !inspectionLoading) {
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
      }
    },
    [isUpdating.current, updateLoading, inspectionLoading, updatePreInspection]
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
  const formCondition = useMemo(() => {
    return {
      preInspection: !!preInspection,
      status: preInspection?.status === InspectionStatus.Draft,
      operator: !!preInspection?.operator,
      startDate: !!preInspection?.startDate,
      season: !!preInspection?.season,
    }
  }, [preInspection])

  // Validation issues that affect the form at this moment
  const activeBlockers = Object.entries(formCondition)
    .filter(([, status]) => !status)
    .map(([key]) => key)

  let OperatorSeasonSelect = useMemo(
    () => (
      <FormColumn width="50%">
        <ControlGroup>
          <SelectOperator
            label="Liikennöitsijä"
            theme="light"
            value={operator}
            onSelect={setGlobalOperator}
          />
        </ControlGroup>
        <ControlGroup>
          <SelectSeason
            label="Aikataulukausi"
            theme="light"
            value={season}
            onSelect={setGlobalSeason}
          />
        </ControlGroup>
      </FormColumn>
    ),
    [preInspection, createUpdateCallback]
  )

  return (
    <CreatePreInspectionFormView>
      {activeBlockers.length !== 0 && (
        <MessageContainer>
          {activeBlockers.map((blockerName) => (
            <ErrorView key={blockerName}>{blockerName}</ErrorView>
          ))}
        </MessageContainer>
      )}
      {inspectionLoading ? (
        <PageLoading />
      ) : !preInspection ? (
        <>
          <SectionHeading theme="light">Valitse liikennöitsijä</SectionHeading>
          <FormWrapper>{OperatorSeasonSelect}</FormWrapper>
        </>
      ) : (
        <>
          <SectionHeading theme="light">Perustiedot</SectionHeading>
          <FormWrapper>
            {OperatorSeasonSelect}
            <FormColumn>
              <InputLabel theme="light">Tuotantojakso</InputLabel>
              <ControlGroup>
                <SelectDate
                  name="production_start"
                  value={preInspection.startDate}
                  onChange={createUpdateCallback('startDate')}
                  label="Alku"
                />
                <Input
                  value={preInspection.endDate}
                  label="Loppu"
                  subLabel={true}
                  disabled={true}
                />
              </ControlGroup>
              <InputLabel theme="light">Tarkastusjakso</InputLabel>
              <ControlGroup>
                <Input
                  value={format(startOfISOWeek(parseISO(preInspection.startDate)), DATE_FORMAT)}
                  label="Alku"
                  subLabel={true}
                  disabled={true}
                />
                <Input
                  value={format(endOfISOWeek(parseISO(preInspection.startDate)), DATE_FORMAT)}
                  label="Loppu"
                  subLabel={true}
                  disabled={true}
                />
              </ControlGroup>
            </FormColumn>
          </FormWrapper>
          <SectionHeading theme="light">Lähtöketjut</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <DepartureBlocks inspectionId={preInspection.id} />
            </FormColumn>
          </FormWrapper>
          <SectionHeading theme="light">Suoritevaatimukset</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <ExecutionRequirements
                startDate={preInspection.startDate}
                operatorId={preInspection?.operator?.operatorId || 0}
              />
            </FormColumn>
          </FormWrapper>
          <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
          <TransparentFormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <ProcurementUnits
                startDate={preInspection.startDate}
                operatorId={preInspection?.operator?.operatorId || 0}
              />
            </FormColumn>
          </TransparentFormWrapper>
        </>
      )}
    </CreatePreInspectionFormView>
  )
})

export default PreInspectionForm
