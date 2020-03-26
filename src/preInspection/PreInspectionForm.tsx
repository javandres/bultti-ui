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
import {
  InitialPreInspectionInput,
  InspectionStatus,
  Operator,
  PreInspectionInput,
  Season,
} from '../schema-types'
import SelectDate from '../common/input/SelectDate'
import { endOfISOWeek, format, parseISO, startOfISOWeek } from 'date-fns'
import Loading, { PageLoading } from '../common/components/Loading'
import Input from '../common/input/Input'
import DepartureBlocks from '../departureBlock/DepartureBlocks'
import ExecutionRequirements from '../executionRequirement/ExecutionRequirements'
import { useMutationData } from '../util/useMutationData'
import {
  createPreInspectionMutation,
  preInspectionQuery,
  updatePreInspectionMutation,
} from './preInspectionQueries'
import ProcurementUnits from '../procurementUnit/ProcurementUnits'
import { DATE_FORMAT, READABLE_TIME_FORMAT } from '../constants'
import { useStateValue } from '../state/useAppState'
import { useQueryData } from '../util/useQueryData'

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

const InspectionMeta = styled.div`
  display: flex;
  margin-left: 1rem;
`

const MetaItem = styled.div`
  padding: 0.5rem 0.75rem;
  margin-right: 1rem;
  border: 1px solid var(--lighter-grey);
  border-radius: 5px;
  color: var(--dark-grey);
  margin-bottom: -0.5rem;
`

const MetaLabel = styled.h6`
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
`

const MetaValue = styled.div`
  font-size: 0.875rem;
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

  let isUpdating = useRef(false)

  let { data: preInspection, loading: inspectionLoading } = useQueryData(preInspectionQuery, {
    skip: !operator || !season,
    notifyOnNetworkStatusChange: true,
    variables: {
      operatorId: operator?.id,
      seasonId: season?.id,
    },
  })

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
    [season, operator, setGlobalSeason, setGlobalOperator]
  )

  console.log(preInspection)

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
          <InspectionMeta>
            {isLoading && <Loading inline={true} />}
            <MetaItem>
              <MetaLabel>Perustettu</MetaLabel>
              <MetaValue>
                {format(parseISO(preInspection.createdAt), READABLE_TIME_FORMAT)}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Viimeksi muokattu</MetaLabel>
              <MetaValue>
                {format(parseISO(preInspection.updatedAt), READABLE_TIME_FORMAT)}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Käyttäjä</MetaLabel>
              <MetaValue>
                {preInspection.createdBy?.name} ({preInspection.createdBy?.organisation})
              </MetaValue>
            </MetaItem>
          </InspectionMeta>
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
