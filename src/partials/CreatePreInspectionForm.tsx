import React, { useEffect } from 'react'
import styled from 'styled-components'
import { observer, useLocalStore } from 'mobx-react-lite'
import { ColumnWrapper, FormHeading, HalfWidth } from '../components/common'
import SelectOperator from '../inputs/SelectOperator'
import SelectSeason from '../inputs/SelectSeason'
import { DepartureBlock, ExecutionRequirement } from '../types/inspection'
import { Operator, Season } from '../schema-types'
import SelectWeek from '../inputs/SelectWeek'
import { useStateValue } from '../state/useAppState'
import { IObservableArray, observable } from 'mobx'
import SelectDate from '../inputs/SelectDate'
import { useQueryData } from '../utils/useQueryData'
import { isBetween } from '../utils/isBetween'
import { endOfISOWeek, parseISO, startOfISOWeek } from 'date-fns'
import { toISODate } from '../utils/toISODate'
import { PageLoading } from '../components/Loading'
import { seasonsQuery } from '../queries/seasons'
import gql from 'graphql-tag'
import Input from '../inputs/Input'
import DepartureBlocks from '../inputs/DepartureBlocks'

const CreatePreInspectionFormView = styled(ColumnWrapper)``
const FormColumn = styled(HalfWidth)``

const ControlGroup = styled.div`
  margin: 0 0 2rem;
  display: flex;
  flex-wrap: nowrap;

  > * {
    flex: 1 1 50%;
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`

interface PreInspectionFormActions {
  whenReady: () => void
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

interface PreInspectionFormData extends PreInspectionFormActions {
  ready: boolean
  operator: Operator | null
  season: Season | null
  executionRequirements: IObservableArray<ExecutionRequirement>
  startDate: string
  endDate: string
  productionStart: string
  productionEnd: string
  departureBlocks: DepartureBlock[]
}

const getCurrentSeason = (date, seasons: Season[]) => {
  return seasons.find((season) => isBetween(date, season.dateBegin, season.dateEnd))
}

const operatingUnitsQuery = gql`
  query operatingUnits($operatorId: String!) {
    operatingUnits(operatorId: $operatorId) {
      id
      operatorId
      routeIds
      operator {
        id
        name
      }
    }
  }
`

const CreatePreInspectionForm: React.FC = observer(() => {
  const [globalOperator] = useStateValue('globalOperator')

  const formState = useLocalStore<PreInspectionFormData>(() => ({
    ready: false,
    operator: globalOperator || null,
    season: null,
    executionRequirements: observable.array([]),
    startDate: '',
    endDate: '',
    productionStart: '',
    productionEnd: '',
    departureBlocks: observable.array([]),
    whenReady: () => {
      formState.ready = true
    },
    selectOperator: (operator = null) => {
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
    setDepartureBlocks: (departureBlocks = []) => {
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

  const { data: seasonsData } = useQueryData(seasonsQuery)

  const { data: operatingUnitsData } = useQueryData(operatingUnitsQuery, {
    variables: {
      operatorId: formState?.operator?.id || '',
    },
  })

  useEffect(() => {
    if (formState.operator?.id !== globalOperator?.id) {
      formState.selectOperator(globalOperator)
    }
  }, [globalOperator])

  useEffect(() => {
    const currentSeason = formState.season || getCurrentSeason(new Date(), seasonsData || [])

    if (currentSeason) {
      formState.setProductionStartDate(currentSeason.dateBegin)
      formState.setProductionEndDate(currentSeason.dateEnd)
      formState.selectSeason(currentSeason)

      // Start and end dates describe the first week of the production period.
      // This is the "comparison period" that is extrapolated across the whole production period.
      formState.setStartDate(toISODate(startOfISOWeek(parseISO(currentSeason.dateBegin))))
      formState.setEndDate(toISODate(endOfISOWeek(parseISO(currentSeason.dateBegin))))

      formState.whenReady()
    }
  }, [seasonsData, formState.season])

  return (
    <CreatePreInspectionFormView>
      {!formState.ready ? (
        <PageLoading />
      ) : (
        <>
          <FormColumn style={{ flex: '1 1 45%' }}>
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
                label="Aikataulukausi"
                theme="light"
                value={formState.season}
                onSelect={formState.selectSeason}
              />
            </ControlGroup>
            <FormHeading theme="light">Tuotantojakso</FormHeading>
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
            <FormHeading theme="light">Tarkastusjakso</FormHeading>
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
          <FormColumn style={{ flex: '1 1 55%' }}>
            <FormHeading theme="light">Lähtöketjut</FormHeading>
            <DepartureBlocks
              departureBlocks={formState.departureBlocks}
              onChange={formState.setDepartureBlocks}
            />
          </FormColumn>
        </>
      )}
    </CreatePreInspectionFormView>
  )
})

export default CreatePreInspectionForm
