import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { executionRequirementsForAreaQuery } from './executionRequirementsQueries'
import { PageSection, SectionTopBar } from '../common/components/common'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import RequirementsTable, { RequirementsTableLayout } from './RequirementsTable'
import { orderBy } from 'lodash'
import { LoadingDisplay } from '../common/components/Loading'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
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
  const inspection = useContext(PreInspectionContext)
  let { id } = inspection || {}

  let [
    previewRequirements,
    { data: executionRequirementsData, loading: requirementsLoading },
  ] = useLazyQueryData(executionRequirementsForAreaQuery, {
    notifyOnNetworkStatusChange: true,
    variables: {
      inspectionId: id,
    },
  })

  let onPreviewRequirements = useCallback(async () => {
    if (inspection && previewRequirements) {
      await previewRequirements({
        variables: {
          inspectionId: inspection?.id,
        },
      })
    }
  }, [previewRequirements, inspection])

  let queueRefetch = useRefetch(onPreviewRequirements, true)

  let areaExecutionRequirements = useMemo(
    () => (!executionRequirementsData ? [] : orderBy(executionRequirementsData, 'area.id')),
    [executionRequirementsData]
  )

  return (
    <ExecutionRequirementsView>
      <SectionTopBar>
        {areaExecutionRequirements?.length !== 0 && (
          <Button
            style={{ marginLeft: 'auto' }}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}
            onClick={queueRefetch}>
            Päivitä
          </Button>
        )}
      </SectionTopBar>
      {!requirementsLoading && areaExecutionRequirements?.length === 0 && (
        <>
          <MessageView>Suoritevaatimukset ei laskettu.</MessageView>
          <div>
            <Button onClick={onPreviewRequirements}>
              Laske suoritevaatimukset ja toteumat
            </Button>
          </div>
        </>
      )}
      <LoadingDisplay loading={requirementsLoading} style={{ top: '0' }} />
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
