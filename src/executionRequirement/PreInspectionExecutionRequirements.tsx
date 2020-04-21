import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  createExecutionRequirementsForPreInspectionMutation,
  executionRequirementsByAreaQuery,
} from './executionRequirementsQueries'
import { FlexRow, MessageView } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import RequirementsTable, { RequirementsTableLayout } from './RequirementsTable'
import { orderBy } from 'lodash'
import { LoadingDisplay } from '../common/components/Loading'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useMutationData } from '../util/useMutationData'
import { useRefetch } from '../util/useRefetch'

const ExecutionRequirementsView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

const HeaderLoadingContainer = styled.div`
  margin-top: -1.75rem;
  position: relative;
  top: 0.625rem;
`

export type PropTypes = {}

const PreInspectionExecutionRequirements: React.FC<PropTypes> = observer(() => {
  const preInspection = useContext(PreInspectionContext)
  let { id } = preInspection || {}

  let [
    fetchRequirements,
    { data: executionRequirementsData, loading: requirementsLoading },
  ] = useLazyQueryData(executionRequirementsByAreaQuery, {
    notifyOnNetworkStatusChange: true,
    variables: {
      preInspectionId: id,
    },
  })

  let [createPreInspectionRequirements, { loading: createLoading }] = useMutationData(
    createExecutionRequirementsForPreInspectionMutation,
    {
      variables: {
        preInspectionId: id,
      },
    }
  )

  let onFetchRequirements = useCallback(async () => {
    if (preInspection && fetchRequirements) {
      await fetchRequirements({
        variables: {
          preInspectionId: preInspection?.id,
        },
      })
    }
  }, [fetchRequirements, preInspection])

  let queueRefetch = useRefetch(onFetchRequirements, true)
  let isLoading = createLoading || requirementsLoading

  let areaExecutionRequirements = useMemo(
    () => (!executionRequirementsData ? [] : orderBy(executionRequirementsData, 'area.id')),
    [executionRequirementsData]
  )

  let onCreateRequirements = useCallback(async () => {
    if (preInspection) {
      await createPreInspectionRequirements()
      queueRefetch()
    }
  }, [createPreInspectionRequirements, preInspection])

  return (
    <ExecutionRequirementsView>
      <FlexRow
        style={{
          margin: '0 -1rem 1rem',
          padding: '0 1rem 0.5rem',
          borderBottom: '1px solid var(--lighter-grey)',
        }}>
        <HeaderLoadingContainer>
          <LoadingDisplay
            loading={isLoading && areaExecutionRequirements.length !== 0}
            inline={true}
          />
        </HeaderLoadingContainer>
        {areaExecutionRequirements?.length !== 0 && (
          <Button
            style={{ marginTop: '-1rem', marginLeft: 'auto' }}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}
            onClick={onFetchRequirements}>
            Päivitä
          </Button>
        )}
      </FlexRow>
      {!isLoading && areaExecutionRequirements?.length === 0 && (
        <>
          <MessageView>Suoritevaatimukset ei laskettu.</MessageView>
          <Button onClick={onCreateRequirements}>Laske suoritevaatimukset ja toteumat</Button>
        </>
      )}
      {isLoading && areaExecutionRequirements.length === 0 && <LoadingDisplay loading={true} />}
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

export default PreInspectionExecutionRequirements
