import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { ReportComponentProps } from './reportUtil'
import { ObservedExecutionRequirementsReportData } from '../schema-types'
import ObservedRequirementsTable from '../executionRequirement/ObservedRequirementsTable'

const ExecutionRequirementsReportView = styled.div`
  margin-top: 1rem;
`

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes<T> = ReportComponentProps<T>

const ObservedExecutionRequirementsReport = observer(
  ({ items }: PropTypes<ObservedExecutionRequirementsReportData>) => {
    return (
      <ExecutionRequirementsReportView>
        {items.map((areaRequirement) => (
          <React.Fragment key={areaRequirement.areaName}>
            <AreaHeading>{areaRequirement.areaName}</AreaHeading>
            <ObservedRequirementsTable executionRequirement={areaRequirement} />
          </React.Fragment>
        ))}
      </ExecutionRequirementsReportView>
    )
  }
)

export default ObservedExecutionRequirementsReport
