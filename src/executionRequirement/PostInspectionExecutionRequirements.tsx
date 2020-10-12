import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import Table, {
  EditValue,
  SaveButton,
  CancelButton,
  EditToolbar,
  ToolbarDescription,
} from '../common/components/Table'
import { ObservedExecutionRequirement, ObservedExecutionValue } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { useObservedRequirements } from './executionRequirementUtils'
import {
  createObservedExecutionRequirementsFromPreInspectionRequirementsMutation,
  observedExecutionRequirementsQuery,
} from './executionRequirementsQueries'
import { groupBy } from 'lodash'
import { readableDateRange } from '../util/formatDate'
import { Info } from '../common/icon/Info'
import { Checkmark2 } from '../common/icon/Checkmark2'
import { CrossThick } from '../common/icon/CrossThick'
import { FlexRow } from '../common/components/common'

const columnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Km vaatimus',
  quotaRequired: '% Osuus',
}

const PostInspectionExecutionRequirementsView = styled.div``

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

export type PropTypes = {}

type EditRequirementValue = EditValue<ObservedExecutionValue> & { requirementId: string }

const PostInspectionExecutionRequirements = observer(({}: PropTypes) => {
  const inspection = useContext(InspectionContext)

  let {
    data: observedRequirements,
    loading: observedRequirementsLoading,
    refetch,
  } = useObservedRequirements(inspection?.id)

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

  let onSaveEditedValues = useCallback(() => {
    console.log(pendingValues)
  }, [pendingValues])

  let onCancelEdit = useCallback(() => {
    setPendingValues([])
  }, [])

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
                        <RequirementValueTable
                          fluid={true}
                          key={requirement.id}
                          onEditValue={createValueEdit(requirement)}
                          pendingValues={pendingValues}
                          editableValues={['quotaRequired']}
                          items={requirement.observedRequirements}
                          columnLabels={columnLabels}
                        />
                      ))}
                    </ExecutionRequirementWeek>
                  ))}
                </RequirementWeeksWrapper>
              </RequirementAreaRow>
            ))}
          </RequirementAreasWrapper>
        ) : (
          <Button onClick={onClickCreateRequirements} loading={createLoading}>
            Create execution requirements from Pre-inspection
          </Button>
        )}
        {pendingValues.length !== 0 && (
          <EditToolbar floating={true}>
            <ToolbarDescription>
              <Info fill="var(--dark-grey)" width={20} height={20} />
              Muista tallentaa taulukkoon tekemäsi muutokset.
            </ToolbarDescription>
            <SaveButton
              onClick={onSaveEditedValues}
              size={ButtonSize.MEDIUM}
              buttonStyle={ButtonStyle.NORMAL}>
              <Checkmark2 fill="white" width="0.5rem" height="0.5rem" />
              Tallenna muutokset
            </SaveButton>
            <CancelButton
              onClick={onCancelEdit}
              size={ButtonSize.MEDIUM}
              buttonStyle={ButtonStyle.SECONDARY_REMOVE}>
              <CrossThick fill="var(--red)" width="0.5rem" height="0.5rem" />
              Peruuta
            </CancelButton>
          </EditToolbar>
        )}
      </PostInspectionExecutionRequirementsView>
    </ExpandableSection>
  )
})

export default PostInspectionExecutionRequirements
