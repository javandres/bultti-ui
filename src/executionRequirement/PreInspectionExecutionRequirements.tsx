import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  createExecutionRequirementsForPreInspectionMutation,
  executionRequirementsByAreaQuery,
} from './executionRequirementsQueries'
import { PageSection, SectionTopBar } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import RequirementsTable, { RequirementsTableLayout } from './RequirementsTable'
import { orderBy } from 'lodash'
import { LoadingDisplay } from '../common/components/Loading'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useMutationData } from '../util/useMutationData'
import { useRefetch } from '../util/useRefetch'
import { MessageView } from '../common/components/Messages'

const ExecutionRequirementsView = styled(PageSection)``

const AreaWrapper = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const AreaHeading = styled.h4`
  margin-bottom: 0;
  margin-top: 0;
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
      <SectionTopBar>
        <HeaderLoadingContainer>
          <LoadingDisplay
            loading={isLoading && areaExecutionRequirements.length !== 0}
            inline={true}
          />
        </HeaderLoadingContainer>
        {areaExecutionRequirements?.length !== 0 && (
          <Button
            style={{ marginLeft: 'auto' }}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}
            onClick={onFetchRequirements}>
            Päivitä
          </Button>
        )}
      </SectionTopBar>
      {!isLoading && areaExecutionRequirements?.length === 0 && (
        <>
          <MessageView>Suoritevaatimukset ei laskettu.</MessageView>
          <Button onClick={onCreateRequirements}>Laske suoritevaatimukset ja toteumat</Button>
        </>
      )}
      {isLoading && areaExecutionRequirements.length === 0 && (
        <LoadingDisplay loading={true} />
      )}
      {areaExecutionRequirements.map((areaRequirements) => (
        <AreaWrapper key={areaRequirements.area.id}>
          <AreaHeading>{areaRequirements.area.name}</AreaHeading>
          <RequirementsTable
            tableLayout={RequirementsTableLayout.BY_VALUES}
            executionRequirement={areaRequirements}
          />
        </AreaWrapper>
      ))}
    </ExecutionRequirementsView>
  )
})

export default PreInspectionExecutionRequirements
