import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import RequirementsTable from '../executionRequirement/RequirementsTable'
import { ReportComponentProps } from './reportTypes'
import { text, Text } from '../util/translate'
import { ExecutionRequirementsReportData } from '../schema-types'
import { MessageView } from '../common/components/Messages'
import { RequirementsTableLayout } from '../executionRequirement/executionRequirementUtils'

const ExecutionRequirementsReportView = styled.div`
  margin-top: 1rem;
`

const AreaHeading = styled.h4`
  margin-bottom: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes<T> = ReportComponentProps<T>

const ExecutionRequirementsReport = observer(
  ({ items, testId }: PropTypes<ExecutionRequirementsReportData>) => {
    return (
      <ExecutionRequirementsReportView>
        {items.map((areaRequirement) => (
          <React.Fragment key={areaRequirement.id}>
            <AreaHeading>
              {text(`executionRequirement_area_${areaRequirement.areaName}`)},{' '}
              {text('executionRequirement_leeway')} {areaRequirement.sanctionLeeway}%
            </AreaHeading>
            <RequirementsTable
              testId={testId}
              tableLayout={RequirementsTableLayout.BY_VALUES}
              executionRequirement={areaRequirement}
            />
          </React.Fragment>
        ))}
        {items.length === 0 && (
          <MessageView>
            <Text>executionRequirement_report_notAvailable</Text>
          </MessageView>
        )}
      </ExecutionRequirementsReportView>
    )
  }
)

export default ExecutionRequirementsReport
