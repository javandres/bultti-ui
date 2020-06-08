import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { PageTitle } from '../common/components/Typography'
import { Page } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { reportsQuery } from '../reports/reportQueries'
import ReportListItem from '../reports/ReportListItem'
import { MessageView } from '../common/components/Messages'
import { TextButton } from '../common/components/Button'
import ReportEditor from '../reports/ReportEditor'

const ReportsPageView = styled(Page)``

const ReportContentView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const ReportsPage = observer(({ children }: PropTypes) => {
  let { data: reportsData, loading: reportsLoading } = useQueryData(reportsQuery)
  let reports = useMemo(() => reportsData || [], [reportsData])

  const [reportsExpanded, setReportsExpanded] = useState(false)

  const toggleReportsExpanded = useCallback(() => {
    setReportsExpanded((currentVal) => !currentVal)
  }, [])

  return (
    <ReportsPageView>
      <PageTitle>Raportit</PageTitle>
      {!reportsData && !reportsLoading && <MessageView>Ei raportteja...</MessageView>}
      <ReportContentView>
        {reports.length !== 0 && (
          <TextButton onClick={toggleReportsExpanded}>
            {reportsExpanded ? 'Piilota kaikki raportit' : 'Näytä kaikki raportit'}
          </TextButton>
        )}
        {reports.map((reportItem) => (
          <ReportListItem
            key={reportItem.name}
            reportData={reportItem}
            isExpanded={reportsExpanded}>
            <ReportEditor report={reportItem} />
          </ReportListItem>
        ))}
      </ReportContentView>
    </ReportsPageView>
  )
})

export default ReportsPage
