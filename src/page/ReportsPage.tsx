import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { FlexRow, Page } from '../common/components/common'
import { useQueryData } from '../util/useQueryData'
import { reportsQuery, updateReportOrderMutation } from '../report/reportQueries'
import { MessageView } from '../common/components/Messages'
import { Button, ButtonSize, ButtonStyle, TextButton } from '../common/components/Button'
import { orderBy } from 'lodash'
import { ArrowDown } from '../common/icon/ArrowDown'
import { useMutationData } from '../util/useMutationData'
import { Report, ReportOrderInput } from '../schema-types'
import ReportEditor from '../report/ReportEditor'
import ReportListItem from '../report/ReportListItem'
import { useStateValue } from '../state/useAppState'
import { requireHSLUser } from '../util/userRoles'
import { PageTitle } from '../common/components/PageTitle'
import { useRefetch } from '../util/useRefetch'

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
  let [user] = useStateValue('user')
  let [newReport, setNewReport] = useState<Partial<Report> | null>(null)

  let { data: reportsData, loading: reportsLoading, refetch: refetchReports } = useQueryData(
    reportsQuery
  )

  let refetch = useRefetch(refetchReports)

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
        nextAdjacentOrder = Math.min(reportOrders.length - 1, nextOrder + 1)
      }

      if (reorderDirection === 'down') {
        nextOrder = Math.min(reportOrders.length - 1, changedReport.order + 1)
        nextAdjacentOrder = Math.max(0, nextOrder - 1)
      }

      // Exit if no change was made
      if (nextOrder === changedReport.order) {
        return
      }

      changedReport.order = nextOrder
      let adjacentReport = nextReportOrders.splice(nextOrder, 1, changedReport)[0]

      if (adjacentReport) {
        adjacentReport.order = nextAdjacentOrder
        nextReportOrders.splice(nextAdjacentOrder, 0, adjacentReport)
      }

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

  const onCreateNewReport = useCallback(() => {
    setNewReport({
      title: 'Uusi raportti',
      order: Math.max(0, (reportOrders[reportOrders.length - 1]?.order || -1) + 1),
    })
  }, [reportOrders])

  let existingNames = useMemo(() => reports.map((r) => r.name), [reports])
  let userCanEdit = requireHSLUser(user)

  return (
    <ReportsPageView>
      <PageTitle loading={reportsLoading} onRefresh={refetch}>
        Raportit
      </PageTitle>
      <ReportContentView>
        {(!reportsData || reportsData.length === 0) && !reportsLoading && (
          <MessageView>Ei raporttiasetuksia.</MessageView>
        )}
        <FlexRow>
          {reports.length !== 0 && (
            <TextButton onClick={toggleReportsExpanded}>
              {reportsExpanded ? 'Piilota kaikki raportit' : 'Näytä kaikki raportit'}
            </TextButton>
          )}
          {userCanEdit && !newReport && (
            <Button
              onClick={onCreateNewReport}
              buttonStyle={ButtonStyle.NORMAL}
              size={ButtonSize.MEDIUM}
              style={{ marginLeft: 'auto' }}>
              Uusi raportti
            </Button>
          )}
        </FlexRow>
        {userCanEdit && newReport && (
          <ReportListItem key="new" reportData={newReport as Report} isExpanded={true}>
            <ReportEditor
              readOnly={false}
              existingNames={existingNames}
              isNew={true}
              onCancel={() => setNewReport(null)}
              report={newReport as Report}
            />
          </ReportListItem>
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
            <ReportEditor readOnly={!userCanEdit} report={reportItem} />
          </ReportListItem>
        ))}
      </ReportContentView>
    </ReportsPageView>
  )
})

export default ReportsPage
