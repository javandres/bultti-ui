import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import Table from '../common/components/Table'
import { ExecutionRequirementValue, ObservedExecutionValue } from '../schema-types'
import { useMutationData } from '../util/useMutationData'
import { useObservedRequirements } from './executionRequirementUtils'
import {
  createObservedExecutionRequirementsFromPreInspectionRequirementsMutation,
  observedExecutionRequirementsQuery,
} from './executionRequirementsQueries'

const columnLabels: { [key in keyof ObservedExecutionValue]?: string } = {
  emissionClass: 'Päästöluokka',
  kilometersRequired: 'Km vaatimus',
  quotaRequired: '% Osuus',
  equipmentCountRequired: 'Vaatimus kpl',
  kilometersObserved: 'Toteuma km',
  quotaObserved: 'Toteuma % osuus',
  differencePercentage: '% ero',
  cumulativeDifferencePercentage: 'Kumul. % ero',
  equipmentCountObserved: 'Toteuma kpl',
  sanctionThreshold: 'Sanktioraja 5%',
  sanctionAmount: 'Sanktiomäärä',
  classSanctionAmount: 'PL/sanktiomäärä',
}

const PostInspectionExecutionRequirementsView = styled.div`
  min-height: 300px;
`

const RequirementWeeksWrapper = styled.div`
  width: 100%;
  position: relative;
`

const ExecutionRequirementWeek = styled.div`
  margin-top: 1rem;
`

const AreaHeading = styled.h4`
  margin-bottom: 1rem;
  margin-top: 0;
`

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

  return (
    <ExpandableSection
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
          <RequirementWeeksWrapper>
            <ExecutionRequirementWeek>
              {observedRequirements.map((requirement) => (
                <>
                  <AreaHeading>{requirement.area.name}</AreaHeading>
                  <Table
                    items={requirement.observedRequirements}
                    columnLabels={columnLabels}
                  />
                </>
              ))}
            </ExecutionRequirementWeek>
          </RequirementWeeksWrapper>
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
