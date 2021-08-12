import React from 'react'
import { observer } from 'mobx-react-lite'
import { PageTitle } from '../common/components/PageTitle'
import { SectionHeading } from '../common/components/Typography'
import { FlexRow, Page, PageContainer, PageSection } from '../common/components/common'
import { gql } from '@apollo/client'
import { useQueryData } from '../util/useQueryData'
import styled from 'styled-components/macro'
import { WorkerStatus } from '../schema-types'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { Text } from '../util/translate'
import { LoadingDisplay } from '../common/components/Loading'

const workerStatusQuery = gql`
  query workerStatus {
    workerStatus {
      id
      taskStartedAt
      taskName
      taskParams
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
  flex: 1 0 auto;
`

const ItemSectionHeading = styled.h5`
  margin-bottom: 0.5rem;
  margin-top: 0;
`

const StatusPage: React.FC = observer(({ children }) => {
  let {
    data: workerStatus = [],
    loading,
    refetch,
  } = useQueryData<WorkerStatus[]>(workerStatusQuery)

  return (
    <Page>
      <PageTitle>Status</PageTitle>
      <PageContainer>
        <PageSection>
          <LoadingDisplay loading={loading} />
          <FlexRow>
            <SectionHeading>Worker status</SectionHeading>
            <Button
              style={{ marginLeft: 'auto' }}
              size={ButtonSize.SMALL}
              buttonStyle={ButtonStyle.SECONDARY}
              loading={loading}
              onClick={() => refetch()}>
              <Text>update</Text>
            </Button>
          </FlexRow>
          {workerStatus.length === 0 && <div>Currently not working on any task.</div>}

          {workerStatus.map((status) => (
            <WorkerStatusItem key={status.id}>
              <ItemSection>
                <ItemSectionHeading>Task</ItemSectionHeading>
                {status.taskName}
              </ItemSection>
              <ItemSection>
                <ItemSectionHeading>Started</ItemSectionHeading>
                {status.taskStartedAt}
              </ItemSection>
              <ItemSection style={{ maxWidth: '33%' }}>
                <ItemSectionHeading>Params</ItemSectionHeading>
                <pre style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                  <code>{JSON.stringify(JSON.parse(status.taskParams || ''), null, 2)}</code>
                </pre>
              </ItemSection>
            </WorkerStatusItem>
          ))}
        </PageSection>
      </PageContainer>
    </Page>
  )
})

export default StatusPage
