import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import RequirementsTable from '../executionRequirement/RequirementsTable'
import { ReportComponentProps } from './reportUtil'
import { ExecutionRequirement } from '../schema-types'
import { MessageView } from '../common/components/Messages'
import { RequirementsTableLayout } from '../executionRequirement/executionRequirementUtils'

const ExecutionRequirementsReportView = styled.div``

const AreaHeading = styled.h4`
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`

export type PropTypes<T> = ReportComponentProps<T>

const ExecutionRequirementsReport = observer(({ items }: PropTypes<ExecutionRequirement>) => {
  return (
    <ExecutionRequirementsReportView>
      {items.map((areaRequirements) => (
        <React.Fragment key={areaRequirements.area.id}>
          <AreaHeading>{areaRequirements.area.name}</AreaHeading>
          <RequirementsTable
            tableLayout={RequirementsTableLayout.BY_VALUES}
            executionRequirement={areaRequirements}
          />
        </React.Fragment>
      ))}
      {items.length === 0 && (
        <MessageView>
          Suoritevaatimukset ei laskettu. Laske ennakkotarkastuksen suoritevaatimukset
          ennakkotarkastuksen muokkaus-näkymästä.
        </MessageView>
      )}
    </ExecutionRequirementsReportView>
  )
})

export default ExecutionRequirementsReport
