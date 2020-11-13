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

const columnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Km vaatimus',
  quotaRequired: '% Osuus',
}

const observedColumnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersObserved: 'Toteutetut km',
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

const ObservedHeading = styled(WeekHeading)`
  font-size: 1rem;
`

const WeekDateHeading = styled.h5`
  margin-bottom: 1rem;
  margin-top: 0;
  font-weight: bold;
`

const RequirementValueTable = styled(Table)``

export type PropTypes = {}

type EditRequirementValue = EditValue<ObservedExecutionValue> & { requirementId: string }

const PostInspectionExecutionRequirements = observer(() => {
  const inspection = useContext(InspectionContext)

  let {
    data: observedRequirements,
    loading: observedRequirementsLoading,
    refetch,
  } = useObservedRequirements(inspection?.id)

  let [previewObservedRequirement, { loading: previewLoading }] = useLazyQueryData(
    previewObservedRequirementQuery
  )

  let onPreviewRequirement = useCallback(
    (requirementId) => {
      previewObservedRequirement({
        variables: {
          requirementId,
        },
      })
    },
    [previewObservedRequirement]
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

  let onClickCreateRequirements = useCallback(async () => {
    if (inspection) {
      await createRequirements({
        variables: {
          postInspectionId: inspection?.id,
        },
      })
    }
  }, [inspection, createRequirements])

  let requirementsByAreaAndWeek: Array<[
    string,
    Array<[string, ObservedExecutionRequirement[]]>
  ]> = useMemo(
    () =>
      Object.entries<ObservedExecutionRequirement[]>(
        groupBy<ObservedExecutionRequirement>(observedRequirements, 'area.name')
      ).map(([areaName, areaReqs]) => [
        areaName,
        Object.entries<ObservedExecutionRequirement[]>(
          groupBy<ObservedExecutionRequirement>(areaReqs, (req) =>
            readableDateRange(req.startDate, req.endDate)
          )
        ),
      ]),
    [observedRequirements]
  )

  let [pendingValues, setPendingValues] = useState<EditRequirementValue[]>([])

  let createValueEdit = useCallback(
    (requirement) => (key, value, item) => {
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
    []
  )

  let onSaveEditedValues = useCallback(async () => {
    let updateQueries: Promise<unknown>[] = []
    let requirementGroups = Object.entries<EditRequirementValue[]>(
      groupBy<EditRequirementValue>(pendingValues, 'requirementId')
    )

    for (let [requirementId, reqPendingValues] of requirementGroups) {
      let updateValues = new Map<string, ObservedRequirementValueInput>()

      for (let value of reqPendingValues) {
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
  }, [pendingValues, updateRequirements])

  let onCancelEdit = useCallback(() => {
    setPendingValues([])
  }, [])

  let createGetColumnTotal = useCallback(
    (requirement: ObservedExecutionRequirement) => (key: string) => {
      if (key === 'emissionClass') {
        return ''
      }

      let totalVal = round(getTotal<any, string>(requirement.observedRequirements, key))

      switch (key) {
        case 'quotaRequired':
          return `${totalVal}%`
        case 'kilometersRequired':
          return `${totalVal} km`
        default:
          return totalVal
      }
    },
    []
  )

  return (
    <ExpandableSection
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
                            onEditValue={createValueEdit(requirement)}
                            pendingValues={pendingValues}
                            editableValues={['quotaRequired']}
                            items={requirement.observedRequirements}
                            columnLabels={columnLabels}
                            getColumnTotal={createGetColumnTotal(requirement)}
                            onSaveEdit={onSaveEditedValues}
                            onCancelEdit={onCancelEdit}
                            showToolbar={false}
                          />
                          <FlexRow>
                            <Button
                              onClick={() => onPreviewRequirement(requirement.id)}
                              loading={previewLoading}>
                              Esikatsele toteuma
                            </Button>
                          </FlexRow>
                          {requirement.observedRequirements.some(
                            (val) => !!val.quotaObserved
                          ) && (
                            <>
                              <ObservedHeading>Toteutuneet arvot</ObservedHeading>
                              <RequirementValueTable
                                fluid={true}
                                items={requirement.observedRequirements}
                                columnLabels={observedColumnLabels}
                                getColumnTotal={createGetColumnTotal(requirement)}
                              />
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </ExecutionRequirementWeek>
                  ))}
                </RequirementWeeksWrapper>
              </RequirementAreaRow>
            ))}
          </RequirementAreasWrapper>
        ) : !observedRequirementsLoading ? (
          <Button onClick={onClickCreateRequirements} loading={createLoading}>
            Create execution requirements from Pre-inspection
          </Button>
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
