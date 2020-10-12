import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import Table from '../common/components/Table'
import { ObservedExecutionRequirement, ObservedExecutionValue } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { useObservedRequirements } from './executionRequirementUtils'
import {
  createObservedExecutionRequirementsFromPreInspectionRequirementsMutation,
  observedExecutionRequirementsQuery,
} from './executionRequirementsQueries'
import { groupBy } from 'lodash'

const columnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Km vaatimus',
  quotaRequired: '% Osuus',
}

const PostInspectionExecutionRequirementsView = styled.div`
  min-height: 300px;
`

const RequirementAreasWrapper = styled.div``

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

const WeekHeading = styled.h5`
  margin-bottom: 1rem;
  margin-top: 0;
  font-weight: bold;
`

const RequirementValueTable = styled(Table)``

export type PropTypes = {}

type WeekOption = { id: number; label: string }

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
          groupBy<ObservedExecutionRequirement>(
            areaReqs,
            (req) => `${req.startDate} - ${req.endDate}`
          )
        ),
      ]),
    [observedRequirements]
  )

  let emissionClasses = useMemo(
    () =>
      observedRequirements[0].observedRequirements.map((val) => ({
        emissionClass: val.emissionClass,
      })),
    [observedRequirements]
  )

  return (
    <ExpandableSection
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
                <RequirementWeeksWrapper>
                  {areaReqs.map(([weekLabel, weekRequirementAreas]) => (
                    <ExecutionRequirementWeek key={weekLabel}>
                      <WeekHeading>{weekLabel}</WeekHeading>
                      {weekRequirementAreas.map((requirement) => (
                        <RequirementValueTable
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
      </PostInspectionExecutionRequirementsView>
    </ExpandableSection>
  )
})

export default PostInspectionExecutionRequirements
