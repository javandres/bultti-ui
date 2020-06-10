import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { PageTitle } from '../common/components/Typography'
import { Page } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { reportsQuery, updateReportOrderMutation } from '../reports/reportQueries'
import { MessageView } from '../common/components/Messages'
import { TextButton } from '../common/components/Button'
import { orderBy } from 'lodash'
import { ArrowDown } from '../common/icon/ArrowDown'
import { useMutationData } from '../util/useMutationData'
import { ReportOrderInput } from '../schema-types'
import ReportEditor from '../reports/ReportEditor'
import ReportListItem from '../reports/ReportListItem'

const ReportsPageView = styled(Page)``

const ReportContentView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

const OrderSection = styled.div`
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
`

const OrderButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 0;
  background: none;
  display: flex;
  flex: 1 0 auto;
  cursor: pointer;
  outline: none;

  &:first-child {
    border-bottom: 1px solid var(--lighter-grey);
  }

  &:active {
    background: var(--lightest-grey);
  }
`

export type PropTypes = {
  children?: React.ReactNode
} & RouteComponentProps

const ReportsPage = observer(({ children }: PropTypes) => {
  let { data: reportsData, loading: reportsLoading } = useQueryData(reportsQuery)

  let [updateReportOrder] = useMutationData(updateReportOrderMutation)

  // Reports ordered by their `order` prop.
  let reports = useMemo(() => orderBy(reportsData || [], 'order'), [reportsData])

  // Report order objects (id and order props of Report) which can be updated
  let [reportOrders, setReportOrders] = useState<ReportOrderInput[]>([])

  // Update the state when the reports are updated.
  useEffect(() => {
    let nextOrders: ReportOrderInput[] = reports.map((rep, index) => ({
      id: rep.id,
      order: rep.order || index, // Default to current index if unset
    }))

    setReportOrders(nextOrders)
  }, [reports])

  // Now when we have both preliminary ordered reports and report order state,
  // order the reports in the view by the state order.
  let orderedReports = useMemo(
    () => orderBy(reports, (rep) => reportOrders.find((r) => r.id === rep.id)?.order || 0),
    [reports, reportOrders]
  )

  const onChangeReportOrder = useCallback(
    (reportId: string, reorderDirection: 'up' | 'down') => {
      let changedReport = reportOrders.find((r) => r.id === reportId)

      if (!changedReport) {
        return
      }

      let nextReportOrders = [...reportOrders]

      let nextOrder
      let nextAdjacentOrder

      if (reorderDirection === 'up') {
        nextOrder = Math.max(0, changedReport.order - 1)
        nextAdjacentOrder = nextOrder + 1
      }

      if (reorderDirection === 'down') {
        nextOrder = changedReport.order + 1
        nextAdjacentOrder = Math.max(0, nextOrder - 1)
      }

      changedReport.order = nextOrder
      let adjacentReport = nextReportOrders.splice(nextOrder, 1, changedReport)[0]
      adjacentReport.order = nextAdjacentOrder
      nextReportOrders.splice(nextAdjacentOrder, 0, adjacentReport)

      setReportOrders(nextReportOrders)

      updateReportOrder({
        variables: {
          reportOrders: nextReportOrders,
        },
      })
    },
    [reportOrders, updateReportOrder]
  )

  const [reportsExpanded, setReportsExpanded] = useState(true)

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
        {orderedReports.map((reportItem) => (
          <ReportListItem
            key={reportItem.id}
            reportData={reportItem}
            isExpanded={reportsExpanded}
            headerContent={
              <OrderSection>
                <OrderButton onClick={() => onChangeReportOrder(reportItem.id, 'up')}>
                  <ArrowDown
                    style={{ transform: 'rotate(180deg)' }}
                    fill="var(--dark-grey)"
                    width="1rem"
                    height="1rem"
                  />
                </OrderButton>
                <OrderButton onClick={() => onChangeReportOrder(reportItem.id, 'down')}>
                  <ArrowDown fill="var(--dark-grey)" width="1rem" height="1rem" />
                </OrderButton>
              </OrderSection>
            }>
            <ReportEditor report={reportItem} />
          </ReportListItem>
        ))}
      </ReportContentView>
    </ReportsPageView>
  )
})

export default ReportsPage
