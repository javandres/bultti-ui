import React, { useContext } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Button } from '../common/components/buttons/Button'
import RequirementsTable from './RequirementsTable'
import { LoadingDisplay } from '../common/components/Loading'
import { InspectionContext } from '../inspection/InspectionContext'
import { MessageView } from '../common/components/Messages'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'
import {
  RequirementsTableLayout,
  usePreInspectionAreaRequirements,
} from './executionRequirementUtils'
import { Text } from '../util/translate'
import { FlexRow } from '../common/components/common'

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

    let {
      data: areaExecutionRequirements,
      loading: requirementsLoading,
      refetch,
    } = usePreInspectionAreaRequirements(id)

    return (
      <ExpandableSection
        testId="execution_requirements_section"
        error={!isValid}
        headerContent={
          <HeaderMainHeading>
            <Text>executionRequirements</Text>
          </HeaderMainHeading>
        }>
        {!requirementsLoading && areaExecutionRequirements?.length === 0 && (
          <>
            <MessageView>
              <Text>preInspection_noCalculatedExecutionRequirements</Text>
            </MessageView>
            <div>
              <Button
                data-cy="fetch_execution_requirements"
                onClick={refetch}
                loading={requirementsLoading}>
                <Text>preInspection_calculateExecutionRequirements</Text>
              </Button>
            </div>
          </>
        )}
        <div style={{ position: 'relative' }}>
          <LoadingDisplay loading={requirementsLoading} style={{ top: '0' }} />
          <FlexRow>
            <Button
              style={{ marginLeft: 'auto' }}
              onClick={refetch}
              loading={requirementsLoading}>
              <Text>update</Text>
            </Button>
          </FlexRow>
          {areaExecutionRequirements.map((areaRequirement) => (
            <AreaWrapper key={areaRequirement.area.id}>
              <AreaHeading>{areaRequirement.area.name}</AreaHeading>
              <RequirementsTable
                testId="execution_requirements_table"
                tableLayout={RequirementsTableLayout.BY_VALUES}
                executionRequirement={areaRequirement}
              />
            </AreaWrapper>
          ))}
        </div>
      </ExpandableSection>
    )
  }
)

export default PreInspectionExecutionRequirements
