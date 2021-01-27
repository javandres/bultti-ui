import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import Table, { EditValue } from '../common/components/Table'
import {
  InspectionValidationError,
  ObservedExecutionRequirement,
  ObservedExecutionValue,
  ObservedRequirementValueInput,
} from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { useObservedRequirements } from './executionRequirementUtils'
import {
  createObservedExecutionRequirementsFromPreInspectionRequirementsMutation,
  observedExecutionRequirementsQuery,
  previewObservedRequirementQuery,
  removeExecutionRequirementsFromPostInspectionMutation,
  updateObservedExecutionRequirementValuesMutation,
} from './executionRequirementsQueries'
import { groupBy, toString } from 'lodash'
import { readableDateRange } from '../util/formatDate'
import { FlexRow } from '../common/components/common'
import { round } from '../util/round'
import { getTotal } from '../util/getTotal'
import { LoadingDisplay } from '../common/components/Loading'
import FormSaveToolbar from '../common/components/FormSaveToolbar'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { useHasInspectionError } from '../util/hasInspectionError'
import { inspectionQuery } from '../inspection/inspectionQueries'

const columnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Km vaatimus',
  kilometersObserved: 'Toteutetut km',
  quotaRequired: '% Osuus',
  quotaObserved: 'Toteutettu % osuus',
  averageAgeWeightedObserved: 'Tot. painotettu keski-ikä',
  equipmentCountObserved: 'Ajoneuvomäärä',
}

const PostInspectionExecutionRequirementsView = styled.div`
  position: relative;
  min-height: 120px;
`

const RequirementAreasWrapper = styled.div`
  padding-bottom: 3rem;
`

const RequirementAreaRow = styled.div``

const RequirementWeeksWrapper = styled.div`
  width: 100%;
`

const ExecutionRequirementWeek = styled.div`
  margin-bottom: 2rem;
`

const AreaHeading = styled.h4`
  margin-bottom: 1rem;
  margin-top: 0;
`

const WeekHeading = styled.h3`
  margin-bottom: 0.5rem;
  font-weight: normal;
`

const WeekDateHeading = styled.h5`
  margin-bottom: 1rem;
  margin-top: 0;
  font-weight: bold;
`

const RequirementValueTable = styled(Table)``

export type PropTypes = {
  isEditable: Boolean
}

type EditRequirementValue = EditValue<ObservedExecutionValue> & { requirementId: string }

const PostInspectionExecutionRequirements = observer(({ isEditable }: PropTypes) => {
  const inspection = useContext(InspectionContext)

  let execReqsMissing = useHasInspectionError(
    inspection,
    InspectionValidationError.MissingExecutionRequirements
  )

  let {
    data: observedRequirements,
    loading: observedRequirementsLoading,
    refetch,
  } = useObservedRequirements(inspection?.id)

  let [previewObservedRequirement, { loading: previewLoading }] = useLazyQueryData(
    previewObservedRequirementQuery
  )

  let [requirementPreviewLoadingId, setRequirementPreviewLoadingId] = useState('')

  let onPreviewRequirement = useCallback(
    (requirementId) => {
      if (isEditable) {
        setRequirementPreviewLoadingId(requirementId)

        previewObservedRequirement({
          variables: {
            requirementId,
          },
        })
      }
    },
    [previewObservedRequirement, isEditable]
  )

  let [createRequirements, { loading: createLoading }] = useMutationData(
    createObservedExecutionRequirementsFromPreInspectionRequirementsMutation,
    {
      refetchQueries: [
        {
          query: observedExecutionRequirementsQuery,
          variables: {
            postInspectionId: inspection?.id,
          },
        },
        { query: inspectionQuery, variables: { inspectionId: inspection?.id || '' } },
      ],
      notifyOnNetworkStatusChange: true,
      variables: {
        postInspectionId: inspection?.id,
      },
    }
  )

  let [updateRequirements, { loading: updateLoading }] = useMutationData(
    updateObservedExecutionRequirementValuesMutation
  )

  let [removeRequirements, { loading: removeLoading }] = useMutationData(
    removeExecutionRequirementsFromPostInspectionMutation,
    {
      refetchQueries: [
        {
          query: observedExecutionRequirementsQuery,
          variables: {
            postInspectionId: inspection?.id,
          },
        },
        { query: inspectionQuery, variables: { inspectionId: inspection?.id || '' } },
      ],
    }
  )

  let onClickCreateRequirements = useCallback(async () => {
    if (inspection && isEditable) {
      await createRequirements({
        variables: {
          postInspectionId: inspection?.id,
        },
      })
    }
  }, [inspection, createRequirements, isEditable])

  let onClickRemoveRequirements = useCallback(async () => {
    if (inspection && observedRequirements.length && isEditable) {
      await removeRequirements({
        variables: {
          postInspectionId: inspection?.id,
        },
      })
    }
  }, [inspection, removeRequirements, observedRequirements, isEditable])

  let requirementsByAreaAndWeek: Array<
    [string, Array<[string, ObservedExecutionRequirement[]]>]
  > = useMemo(
    () =>
      Object.entries<ObservedExecutionRequirement[]>(
        groupBy<ObservedExecutionRequirement>(observedRequirements, 'area.name')
      ).map(([areaName, areaReqs]) => [
        areaName,
        Object.entries<ObservedExecutionRequirement[]>(
          groupBy<ObservedExecutionRequirement>(areaReqs, (req) =>
            readableDateRange({ start: req.startDate, end: req.endDate })
          )
        ),
      ]),
    [observedRequirements]
  )

  let [pendingValues, setPendingValues] = useState<EditRequirementValue[]>([])

  let createValueEdit = useCallback(
    (requirement) => (key, value, item) => {
      if (!isEditable) {
        return
      }

      let editValue: EditRequirementValue = {
        key,
        value,
        item,
        requirementId: requirement.id,
      }

      setPendingValues((currentValues) => {
        let existingEditValueIndex = currentValues.findIndex(
          (val) =>
            val.key === key && val.item.id === item.id && val.requirementId === requirement.id
        )

        if (existingEditValueIndex !== -1) {
          currentValues.splice(existingEditValueIndex, 1)
        }

        return [...currentValues, editValue]
      })
    },
    [isEditable]
  )

  let onSaveEditedValues = useCallback(async () => {
    if (!isEditable) {
      return
    }

    let updateQueries: Promise<unknown>[] = []
    let requirementGroups = Object.entries<EditRequirementValue[]>(
      groupBy<EditRequirementValue>(pendingValues, 'requirementId')
    )

    for (let [requirementId, reqPendingValues] of requirementGroups) {
      let updateValues = new Map<string, ObservedRequirementValueInput>()

      for (let value of reqPendingValues) {
        if (!value.item?.id) {
          continue
        }

        let updateItem = updateValues.get(value.item.id) || {
          id: value.item.id,
          emissionClass: value.item.emissionClass,
        }

        updateItem[value.key] = parseFloat(toString(value.value || '0'))
        updateValues.set(value.item.id, updateItem)
      }

      let updatePromise = updateRequirements({
        variables: {
          requirementId,
          updateValues: Array.from(updateValues.values()),
        },
      })

      updateQueries.push(updatePromise)
    }

    setPendingValues([])
    await Promise.all(updateQueries)
  }, [pendingValues, updateRequirements, isEditable])

  let onCancelEdit = useCallback(() => {
    setPendingValues([])
  }, [])

  let createGetColumnTotal = useCallback(
    (requirement: ObservedExecutionRequirement) => (key: string) => {
      if (key === 'emissionClass') {
        return ''
      }

      let totalVal = round(getTotal<any, string>(requirement.observedRequirements, key), 3)

      switch (key) {
        case 'quotaRequired':
        case 'quotaObserved':
          return `${totalVal}%`
        case 'kilometersRequired':
        case 'kilometersObserved':
          return `${totalVal} km`
        case 'averageAgeWeightedObserved':
          return `${totalVal} v`
        case 'equipmentCountObserved':
          return `${totalVal} kpl`
        default:
          return totalVal
      }
    },
    []
  )

  return (
    <ExpandableSection
      error={execReqsMissing}
      isExpanded={true}
      unmountOnClose={true}
      headerContent={
        <>
          <HeaderMainHeading>Suoritevaatimukset</HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            {observedRequirements?.length !== 0 && (
              <Button
                loading={observedRequirementsLoading}
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}
                onClick={refetch}>
                Päivitä
              </Button>
            )}
          </HeaderSection>
        </>
      }>
      <PostInspectionExecutionRequirementsView>
        <LoadingDisplay
          loading={updateLoading || createLoading || observedRequirementsLoading}
        />
        {isEditable && (
          <FlexRow style={{ marginBottom: '1.5rem' }}>
            <Button onClick={onClickCreateRequirements} loading={createLoading}>
              Luo suoritevaatimukset ennakkotarkastuksesta
            </Button>
            {observedRequirements.length !== 0 && (
              <Button
                style={{ marginLeft: 'auto' }}
                onClick={onClickRemoveRequirements}
                loading={removeLoading}
                buttonStyle={ButtonStyle.SECONDARY_REMOVE}>
                Poista tarkastuksen suoritevaatimukset
              </Button>
            )}
          </FlexRow>
        )}
        {observedRequirements.length !== 0 ? (
          <RequirementAreasWrapper>
            {requirementsByAreaAndWeek.map(([areaLabel, areaReqs]) => (
              <RequirementAreaRow key={areaLabel}>
                <AreaHeading>{areaLabel}</AreaHeading>
                <RequirementWeeksWrapper key="asd">
                  {areaReqs.map(([weekLabel, weekRequirementAreas], index) => (
                    <ExecutionRequirementWeek key={areaLabel + weekLabel}>
                      <FlexRow>
                        <WeekHeading>{index + 1}. Viikko</WeekHeading>
                        <WeekDateHeading style={{ marginLeft: 'auto' }}>
                          {weekLabel}
                        </WeekDateHeading>
                      </FlexRow>
                      {weekRequirementAreas.map((requirement) => (
                        <React.Fragment key={requirement.id}>
                          <RequirementValueTable
                            fluid={true}
                            onEditValue={isEditable ? createValueEdit(requirement) : undefined}
                            pendingValues={isEditable ? pendingValues : []}
                            editableValues={isEditable ? ['quotaRequired'] : undefined}
                            items={requirement.observedRequirements}
                            columnLabels={columnLabels}
                            getColumnTotal={createGetColumnTotal(requirement)}
                            onSaveEdit={isEditable ? onSaveEditedValues : undefined}
                            onCancelEdit={isEditable ? onCancelEdit : undefined}
                            showToolbar={false}
                          />
                          {isEditable && (
                            <FlexRow>
                              <Button
                                onClick={() => onPreviewRequirement(requirement.id)}
                                loading={
                                  requirementPreviewLoadingId === requirement.id &&
                                  previewLoading
                                }>
                                {isEditable ? 'Esikatsele' : 'Hae'} viikon toteuma
                              </Button>
                            </FlexRow>
                          )}
                        </React.Fragment>
                      ))}
                    </ExecutionRequirementWeek>
                  ))}
                </RequirementWeeksWrapper>
              </RequirementAreaRow>
            ))}
          </RequirementAreasWrapper>
        ) : null}
        {pendingValues.length !== 0 && (
          <FormSaveToolbar
            floating={true}
            onSave={onSaveEditedValues}
            onCancel={onCancelEdit}
          />
        )}
      </PostInspectionExecutionRequirementsView>
    </ExpandableSection>
  )
})

export default PostInspectionExecutionRequirements
