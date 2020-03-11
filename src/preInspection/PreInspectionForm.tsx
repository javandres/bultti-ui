import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer, useLocalStore } from 'mobx-react-lite'
import {
  Column,
  ColumnWrapper,
  FormError,
  FormMessageContainer,
  InputLabel,
  SectionHeading,
} from '../common/components/common'
import SelectOperator from '../common/inputs/SelectOperator'
import SelectSeason from '../common/inputs/SelectSeason'
import { DepartureBlock, ExecutionRequirement } from '../types/inspection'
import { Operator, ProcurementUnit, Season } from '../schema-types'
import SelectWeek from '../common/inputs/SelectWeek'
import { useStateValue } from '../state/useAppState'
import { IObservableArray, observable } from 'mobx'
import SelectDate from '../common/inputs/SelectDate'
import { useQueryData } from '../utils/useQueryData'
import { endOfISOWeek, parseISO, startOfISOWeek } from 'date-fns'
import { toISODate } from '../utils/toISODate'
import { PageLoading } from '../common/components/Loading'
import Input from '../common/inputs/Input'
import DepartureBlocks from './DepartureBlocks'
import ExecutionRequirements from './ExecutionRequirements'
import { seasonsQuery } from '../queries/seasonsQuery'
import moment from 'moment'
import { useMutationData } from '../utils/useMutationData'
import { createPreInspectionMutation } from '../queries/createPreInspectionMutation'
import { orderBy } from 'lodash'
import { useCollectionState } from '../utils/useCollectionState'
import ProcurementUnits from '../procurementUnits/ProcurementUnits'

const currentDate = moment()

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

interface PreInspectionFormActions {
  setInspectionId: (id: string) => void
  setStatus: (nextStatus: PreInspectionFormStatus) => void
  selectOperator: (operator: Operator | null) => void
  selectSeason: (season: Season | null) => void
  changeRequirements: (executionRequirements: ExecutionRequirement[]) => void
  setRequirement: (requirement: ExecutionRequirement, nextValue: string) => void
  removeRequirement: (requirement: ExecutionRequirement) => void
  setDepartureBlocks: (departureBlocks: DepartureBlock[]) => void
  setStartDate: (startDate: string) => void
  setEndDate: (endDate: string) => void
  setProductionStartDate: (startDate: string) => void
  setProductionEndDate: (endDate: string) => void
}

enum PreInspectionFormStatus {
  Uninitialized = 'UNINITIALIZED',
  InitLoading = 'INIT_LOADING',
  Invalid = 'INVALID',
  Draft = 'DRAFT',
  InProduction = 'IN_PRODUCTION',
}

interface PreInspectionFormData extends PreInspectionFormActions {
  inspectionId: string
  status: PreInspectionFormStatus
  operator: Operator | null
  season: Season | null
  executionRequirements: IObservableArray<ExecutionRequirement>
  startDate: string
  endDate: string
  productionStart: string
  productionEnd: string
  departureBlocks: DepartureBlock[]
}

const PreInspectionForm: React.FC = observer(() => {
  const [globalOperator] = useStateValue('globalOperator')

  const formState = useLocalStore<PreInspectionFormData>(() => ({
    inspectionId: '',
    status: PreInspectionFormStatus.Uninitialized,
    operator: globalOperator || null,
    season: null,
    executionRequirements: observable.array([]),
    startDate: '',
    endDate: '',
    productionStart: currentDate
      .clone()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
    productionEnd: '',
    departureBlocks: observable.array([]),
    setInspectionId: (id) => {
      formState.inspectionId = id
    },
    setStatus: (nextStatus: PreInspectionFormStatus) => {
      formState.status = nextStatus
    },
    selectOperator: (operator: Operator | null = null) => {
      formState.operator = operator
    },
    selectSeason: (season: Season | null = null) => {
      formState.season = season || null
    },
    changeRequirements: (requirements: ExecutionRequirement[] = []) => {
      formState.executionRequirements = observable.array(requirements)
    },
    setRequirement: (requirement: ExecutionRequirement, nextValue) => {
      requirement.requirement = nextValue
    },
    removeRequirement: (requirement: ExecutionRequirement) => {
      formState.executionRequirements.remove(requirement)
    },
    setDepartureBlocks: (departureBlocks: DepartureBlock[] = []) => {
      formState.departureBlocks = departureBlocks
    },
    setStartDate: (startDate: string = '') => {
      formState.startDate = startDate
    },
    setEndDate: (endDate: string = '') => {
      formState.endDate = endDate
    },
    setProductionStartDate: (startDate: string = '') => {
      formState.productionStart = startDate
    },
    setProductionEndDate: (endDate: string = '') => {
      formState.productionEnd = endDate
    },
  }))

  const [
    createPreInspection,
    { data: createdInspectionData, loading: inspectionLoading },
  ] = useMutationData(createPreInspectionMutation)

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  // TODO: Error views when status = invalid
  useEffect(() => {
    // A pre-inspection can be created when there is not one currently loading and the form state is uninitialized.
    if (formState.status === PreInspectionFormStatus.Uninitialized && !inspectionLoading) {
      formState.setStatus(PreInspectionFormStatus.InitLoading)

      createPreInspection().then(({ data }) => {
        // No data means the creation failed. If there is data, the
        // pre-inspection is in draft mode (ie can be edited).
        if (!data) {
          formState.setStatus(PreInspectionFormStatus.Invalid)
        } else {
          formState.setStatus(PreInspectionFormStatus.Draft)
        }
      })
    }

    // Set the ID if we have a draft pre-inspection and it is not already set.
    if (
      createdInspectionData &&
      formState.status === PreInspectionFormStatus.Draft &&
      !formState.inspectionId
    ) {
      formState.setInspectionId(createdInspectionData.id)
    }
  }, [formState.status, createdInspectionData, inspectionLoading])

  // Get seasons to display in the seasons select. Selecting a season will also change the dates.
  const { data: seasonsData, loading: seasonsLoading } = useQueryData(seasonsQuery, {
    variables: {
      date: currentDate
        .clone()
        .subtract(1, 'year')
        .startOf('year')
        .format('YYYY-MM-DD'),
    },
  })

  const seasons = useMemo(() => orderBy(seasonsData || [], 'startDate', 'desc'), [seasonsData])

  // Use the global operator as the initially selected operator if no operator
  // has been selected for this form yet.
  useEffect(() => {
    if (!formState.operator) {
      formState.selectOperator(globalOperator)
    }
  }, [globalOperator])

  // Pre-select the first available season if no season is selected.
  useEffect(() => {
    const firstAvailableSeason = seasons && seasons.length !== 0 ? seasons[0] : null

    if (!formState.season && !!firstAvailableSeason) {
      formState.selectSeason(firstAvailableSeason)
    }
  }, [seasons, formState.season])

  // Set dates from the selected season when it changes.
  useEffect(() => {
    if (formState.season) {
      formState.setProductionStartDate(formState.season.startDate)
      formState.setProductionEndDate(formState.season.endDate)
      formState.selectSeason(formState.season)

      // Start and end dates describe the first week of the production period.
      // This is the "comparison period" that is extrapolated across the whole production period.
      formState.setStartDate(toISODate(startOfISOWeek(parseISO(formState.season.startDate))))
      formState.setEndDate(toISODate(endOfISOWeek(parseISO(formState.season.startDate))))
    }
  }, [formState.season])

  const [
    procurementUnits,
    { replace: replaceProcurementUnits, update: updateProcurementUnit },
  ] = useCollectionState<ProcurementUnit>([])

  const onUpdateProcurementUnits = useCallback(() => {}, [procurementUnits])

  // Validate that the form has each dependent piece of data.
  const formCondition = useMemo(() => {
    return {
      status: formState.status === PreInspectionFormStatus.Draft,
      inspectionId: !!formState.inspectionId,
      operator: !!formState.operator,
      productionStart: !!formState.productionStart,
      seasons: seasonsLoading ? true : seasons && seasons.length !== 0,
    }
  }, [
    formState.operator,
    formState.inspectionId,
    formState.productionStart,
    seasons,
    seasonsLoading,
  ])

  // Validation issues that affect the form at this moment
  const activeBlockers = Object.entries(formCondition)
    .filter(([, status]) => !status)
    .map(([key]) => key)

  return (
    <CreatePreInspectionFormView>
      {activeBlockers.length !== 0 && (
        <FormMessageContainer>
          {activeBlockers.map((blockerName) => (
            <FormError key={blockerName}>{blockerName}</FormError>
          ))}
        </FormMessageContainer>
      )}
      {!formState.inspectionId ? (
        <PageLoading />
      ) : (
        <>
          <SectionHeading theme="light">Perustiedot</SectionHeading>
          <FormWrapper>
            <FormColumn width="50%">
              <ControlGroup>
                <SelectOperator
                  label="Liikennöitsijä"
                  theme="light"
                  value={formState.operator}
                  onSelect={formState.selectOperator}
                />
              </ControlGroup>
              <ControlGroup>
                <SelectSeason
                  seasons={seasons}
                  label="Aikataulukausi"
                  theme="light"
                  value={formState.season}
                  onSelect={formState.selectSeason}
                />
              </ControlGroup>
            </FormColumn>
            <FormColumn>
              <InputLabel theme="light">Tuotantojakso</InputLabel>
              <ControlGroup>
                <SelectDate
                  name="production_start"
                  value={formState.productionStart}
                  onChange={formState.setProductionStartDate}
                  label="Alku"
                />
                <Input
                  value={formState.productionEnd}
                  label="Loppu"
                  subLabel={true}
                  disabled={true}
                />
              </ControlGroup>
              <InputLabel theme="light">Tarkastusjakso</InputLabel>
              <ControlGroup>
                <SelectWeek
                  startLabel="Alku"
                  endLabel="Loppu"
                  startDate={formState.startDate}
                  onChangeStartDate={formState.setStartDate}
                  endDate={formState.endDate}
                  onChangeEndDate={formState.setEndDate}
                  maxDate={formState.productionEnd}
                />
              </ControlGroup>
            </FormColumn>
          </FormWrapper>
          <SectionHeading theme="light">Lähtöketjut</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <DepartureBlocks
                departureBlocks={formState.departureBlocks}
                onChangeBlocks={formState.setDepartureBlocks}
              />
            </FormColumn>
          </FormWrapper>
          <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
          <TransparentFormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <ProcurementUnits
                productionDate={formState.productionStart}
                procurementUnits={procurementUnits}
                operatorId={formState?.operator?.operatorId || 0}
                initialize={replaceProcurementUnits}
                onUpdate={onUpdateProcurementUnits}
              />
            </FormColumn>
          </TransparentFormWrapper>
          <SectionHeading theme="light">Suoritevaatimukset</SectionHeading>
          <FormWrapper>
            <FormColumn width="100%" minWidth="510px">
              <ExecutionRequirements
                productionDate={formState.productionStart}
                procurementUnits={procurementUnits}
                operatorId={formState?.operator?.operatorId || 0}
              />
            </FormColumn>
          </FormWrapper>
        </>
      )}
    </CreatePreInspectionFormView>
  )
})

export default PreInspectionForm
