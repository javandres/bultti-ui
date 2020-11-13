import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ReportComponentProps } from './reportUtil'
import { ObservedExecutionRequirement } from '../schema-types'
import { RequirementsTableLayout } from '../executionRequirement/executionRequirementUtils'
import ObservedRequirementsTable from '../executionRequirement/ObservedRequirementsTable'

const ExecutionRequirementsReportView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes<T> = ReportComponentProps<T>

const ObservedExecutionRequirementsReport = observer(
  ({ items }: PropTypes<ObservedExecutionRequirement>) => {
    return (
      <ExecutionRequirementsReportView>
        {items.map((areaRequirements) => (
          <React.Fragment key={areaRequirements.area.id}>
            <AreaHeading>{areaRequirements.area.name}</AreaHeading>
            <ObservedRequirementsTable
              tableLayout={RequirementsTableLayout.BY_VALUES}
              executionRequirement={areaRequirements}
            />
          </React.Fragment>
        ))}
      </ExecutionRequirementsReportView>
    )
  }
)

export default ObservedExecutionRequirementsReport
