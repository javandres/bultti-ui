import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer, useLocalStore } from 'mobx-react-lite'
import {
  Column,
  ColumnWrapper,
  ErrorView,
  InputLabel,
  MessageContainer,
  SectionHeading,
} from '../common/components/common'
import SelectOperator, { operatorIsValid } from '../common/input/SelectOperator'
import SelectSeason from '../common/input/SelectSeason'
import {
  InspectionStatus,
  Operator,
  PreInspection,
  PreInspectionInput,
  Season,
} from '../schema-types'
import SelectDate from '../common/input/SelectDate'
import { addDays, endOfISOWeek, format, parseISO, startOfISOWeek } from 'date-fns'
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
import { autorun, set, toJS } from 'mobx'
import { pickGraphqlData } from '../util/pickGraphqlData'
import isEqual from 'react-fast-compare'
import { pick } from 'lodash'

const currentDate = new Date()

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

enum PreInspectionFormStatus {
  Uninitialized = 'Uninitialized',
  InitLoading = 'InitLoading',
  Invalid = 'Invalid',
  Draft = 'Draft',
  InProduction = 'InProduction',
}

interface PreInspectionFormActions {
  setInspectionId: (id: string) => void
  setStatus: (nextStatus: PreInspectionFormStatus) => void
  selectOperator: (operator: Operator | null) => void
  selectSeason: (season: Season | null) => void
  setStartDate: (startDate: string) => void
  setEndDate: (endDate: string) => void
}

interface PreInspectionFormData {
  id: string
  status: PreInspectionFormStatus
  operator: Operator | null
  season: Season | null
  startDate: string
  endDate: string
}

type LocalFormState = PreInspectionFormActions & PreInspectionFormData

type PreInspectionProps = {
  operator?: Operator | null
  season?: Season | null
}

const compareValues = ['id', 'operator', 'season', 'startDate', 'endDate']

const PreInspectionForm: React.FC<PreInspectionProps> = observer(
  ({ season: preselectedSeason = null, operator: preselectedOperator = null }) => {
    var [isDirty, setIsDirty] = useState(false)

    var formState = useLocalStore<LocalFormState>(() => ({
      id: '',
      status: PreInspectionFormStatus.Uninitialized,
      operator: preselectedOperator || null,
      season: preselectedSeason || null,
      startDate: format(addDays(currentDate, 1), DATE_FORMAT),
      endDate: '',
      setInspectionId: (id) => {
        formState.id = id
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
      setStartDate: (startDate: string = '') => {
        formState.startDate = startDate
      },
      setEndDate: (endDate: string = '') => {
        formState.endDate = endDate
      },
    }))

    let [
      createPreInspection,
      { data: createdInspectionData, loading: inspectionLoading },
    ] = useMutationData(createPreInspectionMutation)

    let [
      updatePreInspection,
      { data: updatedInspectionData, loading: updateLoading },
    ] = useMutationData(updatePreInspectionMutation)

    let prevSavedPreInspection = useMemo(() => updatedInspectionData || createdInspectionData, [
      createdInspectionData,
      updatedInspectionData,
    ])

    // TODO: Clean up update condition logic

    useEffect((): any => {
      if (!isDirty) {
        return autorun(() => {
          let compareFormState = pick(toJS(formState), compareValues)
          let comparePrevSaved = pick(prevSavedPreInspection, compareValues)

          if (!isEqual(comparePrevSaved, compareFormState)) {
            setIsDirty(true)
          }
        })
      }
    }, [isDirty, formState, prevSavedPreInspection])

    // Initialize the form by creating a pre-inspection on the server and getting the ID.
    // TODO: Error views when status = invalid
    useEffect(() => {
      // A pre-inspection can be created when there is not one currently loading and the form state is uninitialized.
      if (
        operatorIsValid(formState?.operator) &&
        formState?.season &&
        formState.status === PreInspectionFormStatus.Uninitialized &&
        !inspectionLoading &&
        !updateLoading
      ) {
        formState.setStatus(PreInspectionFormStatus.InitLoading)
        let operatorId = formState?.operator?.id || 0
        let seasonId = formState?.season?.id || ''

        let preInspectionInput: PreInspectionInput = {
          operatorId,
          seasonId,
          startDate: formState.startDate,
          endDate: formState.endDate,
          status: InspectionStatus.Draft,
        }

        createPreInspection({
          variables: {
            preInspectionInput,
          },
        }).then(({ data }) => {
          if (data) {
            let createdPreInspection = pickGraphqlData(data)
            set(formState, { ...createdPreInspection, status: PreInspectionFormStatus.Draft })
            setIsDirty(false)
          } else {
            formState.setStatus(PreInspectionFormStatus.Invalid)
          }
        })
      }
    }, [formState.status, formState?.operator, formState?.season, inspectionLoading])

    let isUpdating = useRef(false)

    // Update the pre-inspection on changes
    var saveFormState = useCallback(
      async (draftInspection: PreInspectionFormData) => {
        if (
          !isUpdating.current &&
          operatorIsValid(draftInspection.operator) &&
          draftInspection.season &&
          draftInspection.status === PreInspectionFormStatus.Draft &&
          draftInspection.id
        ) {
          isUpdating.current = true

          let preInspectionInput: PreInspectionInput = {
            operatorId: draftInspection?.operator?.id || 0,
            seasonId: draftInspection?.season?.id || '',
            startDate: draftInspection.startDate,
            endDate: draftInspection.endDate,
          }

          let updateResult = await updatePreInspection({
            variables: {
              preInspectionId: draftInspection.id,
              preInspectionInput,
            },
          })

          if (updateResult) {
            let updatedPreInspection: PreInspection = pickGraphqlData(updateResult.data)

            if (updatedPreInspection.id !== draftInspection.id) {
              formState.setInspectionId(updatedPreInspection.id)
            }

            if (
              updatedPreInspection?.operator &&
              updatedPreInspection.operator?.id !== draftInspection.operator?.id
            ) {
              formState.selectOperator(updatedPreInspection.operator)
            }

            if (
              updatedPreInspection?.season &&
              updatedPreInspection.season?.id !== draftInspection.season?.id
            ) {
              formState.selectSeason(updatedPreInspection.season)
            }

            setIsDirty(false)
          }

          isUpdating.current = false
        }
      },
      [formState, isUpdating.current, updatePreInspection]
    )

    useEffect(() => {
      let timeout = setTimeout(() => {
        if (
          formState.status === PreInspectionFormStatus.Draft &&
          !updateLoading &&
          !inspectionLoading &&
          isDirty
        ) {
          saveFormState(formState)
        }
      }, 100)

      return () => clearTimeout(timeout)
    }, [formState, isDirty, saveFormState, updateLoading, inspectionLoading])

    // Use the global operator as the initially selected operator if no operator
    // has been selected for this form yet.
    useEffect(() => {
      if (!formState.operator && preselectedOperator) {
        formState.selectOperator(preselectedOperator)
      }
    }, [preselectedOperator])

    // Use the global season as the initially selected season if no season
    // has been selected for this form yet.
    useEffect(() => {
      if (!formState.season) {
        formState.selectSeason(preselectedSeason)
      }
    }, [preselectedSeason])

    // Set dates from the selected season when it changes.
    useEffect(() => {
      if (formState.season && formState.season.startDate && formState.season.endDate) {
        formState.selectSeason(formState.season)
        formState.setStartDate(formState.season.startDate)
        formState.setEndDate(formState.season.endDate)
      }
    }, [formState.season])

    // Validate that the form has each dependent piece of data.
    const formCondition = useMemo(() => {
      return {
        status: formState.status === PreInspectionFormStatus.Draft,
        inspectionId: !!formState.id,
        operator: !!formState.operator,
        startDate: !!formState.startDate,
        season: !!formState.season,
      }
    }, [formState.operator, formState.id, formState.startDate, formState.season])

    // Validation issues that affect the form at this moment
    const activeBlockers = Object.entries(formCondition)
      .filter(([, status]) => !status)
      .map(([key]) => key)

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
        ) : !createdInspectionData && !formState?.operator ? (
          <>
            <SectionHeading theme="light">Valitse liikennöitsijä</SectionHeading>
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
              </FormColumn>
            </FormWrapper>
          </>
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
                    value={formState.startDate}
                    onChange={formState.setStartDate}
                    label="Alku"
                  />
                  <Input value={formState.endDate} label="Loppu" subLabel={true} disabled={true} />
                </ControlGroup>
                <InputLabel theme="light">Tarkastusjakso</InputLabel>
                <ControlGroup>
                  <Input
                    value={format(startOfISOWeek(parseISO(formState.startDate)), DATE_FORMAT)}
                    label="Alku"
                    subLabel={true}
                    disabled={true}
                  />
                  <Input
                    value={format(endOfISOWeek(parseISO(formState.startDate)), DATE_FORMAT)}
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
                <DepartureBlocks inspectionId={formState.id} />
              </FormColumn>
            </FormWrapper>
            <SectionHeading theme="light">Suoritevaatimukset</SectionHeading>
            <FormWrapper>
              <FormColumn width="100%" minWidth="510px">
                <ExecutionRequirements
                  startDate={formState.startDate}
                  operatorId={formState?.operator?.operatorId || 0}
                />
              </FormColumn>
            </FormWrapper>
            <SectionHeading theme="light">Kilpailukohteet</SectionHeading>
            <TransparentFormWrapper>
              <FormColumn width="100%" minWidth="510px">
                <ProcurementUnits
                  startDate={formState.startDate}
                  operatorId={formState?.operator?.operatorId || 0}
                />
              </FormColumn>
            </TransparentFormWrapper>
          </>
        )}
      </CreatePreInspectionFormView>
    )
  }
)

export default PreInspectionForm
