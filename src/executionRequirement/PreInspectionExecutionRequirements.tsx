import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  createExecutionRequirementsForPreInspectionMutation,
  executionRequirementsByAreaQuery,
  removeExecutionRequirementMutation,
} from './executionRequirementsQueries'
import { PageSection, SectionTopBar, FlexRow } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import RequirementsTable, { RequirementsTableLayout } from './RequirementsTable'
import { orderBy } from 'lodash'
import { LoadingDisplay } from '../common/components/Loading'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useMutationData } from '../util/useMutationData'
import { useRefetch } from '../util/useRefetch'
import { MessageView } from '../common/components/Messages'

const ExecutionRequirementsView = styled(PageSection)`
  min-height: 10rem;
  position: relative;
`

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

  let [execRemoveExecutionRequirement] = useMutationData(removeExecutionRequirementMutation)

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

  let onRemoveExecutionRequirement = useCallback(
    async (requirementId) => {
      if (
        confirm(
          'Olet poistamassa tämän alueen suoritevaatimukset. Poistat samalla siihen kuuluvat kilpailukohteiden vaatimukset. Oletko varma?'
        )
      ) {
        await execRemoveExecutionRequirement({
          variables: {
            requirementId,
          },
        })

        queueRefetch()
      }
    },
    [execRemoveExecutionRequirement, queueRefetch]
  )

  return (
    <ExecutionRequirementsView>
      <SectionTopBar>
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
          <div>
            <Button onClick={onCreateRequirements}>
              Laske suoritevaatimukset ja toteumat
            </Button>
          </div>
        </>
      )}
      <LoadingDisplay loading={isLoading} style={{ top: '0' }} />
      {areaExecutionRequirements.map((areaRequirements) => (
        <AreaWrapper key={areaRequirements.area.id}>
          <AreaHeading>{areaRequirements.area.name}</AreaHeading>
          <RequirementsTable
            tableLayout={RequirementsTableLayout.BY_VALUES}
            executionRequirement={areaRequirements}
          />
          <FlexRow>
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY_REMOVE}
              onClick={() => onRemoveExecutionRequirement(areaRequirements.id)}>
              Poista alueen suoritevaatimus
            </Button>
          </FlexRow>
        </AreaWrapper>
      ))}
    </ExecutionRequirementsView>
  )
})

export default PreInspectionExecutionRequirements
