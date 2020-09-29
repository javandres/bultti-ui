import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { executionRequirementsForAreaQuery } from './executionRequirementsQueries'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import RequirementsTable, { RequirementsTableLayout } from './RequirementsTable'
import { orderBy } from 'lodash'
import { LoadingDisplay } from '../common/components/Loading'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { InspectionContext } from '../inspection/InspectionContext'
import { useRefetch } from '../util/useRefetch'
import { MessageView } from '../common/components/Messages'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { ExecutionRequirement } from '../schema-types'

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

export type PropTypes = {
  isValid: boolean
}

const PreInspectionExecutionRequirements: React.FC<PropTypes> = observer(
  ({ isValid = false }) => {
    const inspection = useContext(InspectionContext)
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

    let areaExecutionRequirements = useMemo<ExecutionRequirement[]>(
      () => (!executionRequirementsData ? [] : orderBy(executionRequirementsData, 'area.id')),
      [executionRequirementsData]
    )

    return (
      <ExpandableSection
        error={!isValid}
        headerContent={
          <>
            <HeaderMainHeading>Suoritevaatimukset</HeaderMainHeading>
            <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
              {areaExecutionRequirements?.length !== 0 && (
                <Button
                  loading={requirementsLoading}
                  style={{ marginLeft: 'auto' }}
                  buttonStyle={ButtonStyle.SECONDARY}
                  size={ButtonSize.SMALL}
                  onClick={queueRefetch}>
                  Päivitä
                </Button>
              )}
            </HeaderSection>
          </>
        }>
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
      </ExpandableSection>
    )
  }
)

export default PreInspectionExecutionRequirements
