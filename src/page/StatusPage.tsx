import React from 'react'
import { observer } from 'mobx-react-lite'
import { PageTitle } from '../common/components/PageTitle'
import { SectionHeading } from '../common/components/Typography'
import { Page, PageContainer, PageSection } from '../common/components/common'
import { gql } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import styled from 'styled-components/macro'
import { WorkerStatus } from '../schema-types'

const workerStatusQuery = gql`
  query workerStatus {
    workerStatus {
      id
      taskStarted
      workingOnTask
    }
  }
`

const WorkerStatusItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--lighter-grey);
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }
`

const ItemSection = styled.div`
  flex: 1;
`

const ItemSectionHeading = styled.h5`
  margin-bottom: 0.5rem;
  margin-top: 0;
`

const StatusPage: React.FC = observer(({ children }) => {
  let { data: workerStatus = [] } = useQueryData<WorkerStatus[]>(workerStatusQuery)

  return (
    <Page>
      <PageTitle>Status</PageTitle>
      <PageContainer>
        <PageSection>
          <SectionHeading>Worker status</SectionHeading>
          {workerStatus.map((status) => (
            <WorkerStatusItem key={status.id}>
              <ItemSection>
                <ItemSectionHeading>Task</ItemSectionHeading>
                {status.workingOnTask}
              </ItemSection>
              <ItemSection>
                <ItemSectionHeading>Started</ItemSectionHeading>
                {status.taskStarted}
              </ItemSection>
            </WorkerStatusItem>
          ))}
        </PageSection>
      </PageContainer>
    </Page>
  )
})

export default StatusPage
