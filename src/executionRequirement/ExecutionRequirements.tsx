import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { PreInspectionContext } from '../preInspection/PreInspectionForm'
import { executionRequirementsByPreInspectionQuery } from './executionRequirementsQueries'
import { FlexRow, MessageView } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import RequirementsTable, { RequirementsTableLayout } from './RequirementsTable'
import { orderBy } from 'lodash'
import Loading from '../common/components/Loading'
import { useLazyQueryData } from '../util/useLazyQueryData'

const ExecutionRequirementsView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes = {}

const ExecutionRequirements: React.FC<PropTypes> = observer(() => {
  const preInspection = useContext(PreInspectionContext)
  let { id } = preInspection || {}

  let [
    execQuery,
    { data: executionRequirementsData, loading: requirementsLoading },
  ] = useLazyQueryData(executionRequirementsByPreInspectionQuery, {
    variables: {
      preInspectionId: id,
    },
  })

  let areaExecutionRequirements = useMemo(
    () => (!executionRequirementsData ? [] : orderBy(executionRequirementsData, 'area.id')),
    [executionRequirementsData]
  )

  let onCalculateRequirements = useCallback(() => {
    if (preInspection) {
      execQuery()
    }
  }, [execQuery, preInspection])

  return (
    <ExecutionRequirementsView>
      <FlexRow
        style={{
          margin: '0 -1rem 1rem',
          padding: '0 1rem 0.5rem',
          borderBottom: '1px solid var(--lighter-grey)',
        }}>
        {areaExecutionRequirements?.length !== 0 && (
          <Button
            style={{ marginTop: '-1rem', marginLeft: 'auto' }}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}
            onClick={onCalculateRequirements}>
            Päivitä
          </Button>
        )}
      </FlexRow>
      {!requirementsLoading && areaExecutionRequirements?.length === 0 && (
        <>
          <MessageView>Suoritevaatimukset ei laskettu.</MessageView>
          <Button onClick={onCalculateRequirements}>Laske suoritevaatimukset ja toteumat</Button>
        </>
      )}
      {requirementsLoading && <Loading />}
      {areaExecutionRequirements.map((areaRequirements) => (
        <React.Fragment key={areaRequirements.area.id}>
          <AreaHeading>{areaRequirements.area.name}</AreaHeading>
          <RequirementsTable
            tableLayout={RequirementsTableLayout.BY_VALUES}
            executionRequirement={areaRequirements}
          />
        </React.Fragment>
      ))}
    </ExecutionRequirementsView>
  )
})

export default ExecutionRequirements
