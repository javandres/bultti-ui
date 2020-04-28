import React, { useCallback, useContext, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PreInspectionContext } from './PreInspectionContext'
import { ErrorView, FlexRow, MessageView } from '../common/components/common'
import styled from 'styled-components'
import { useQueryData } from '../util/useQueryData'
import { availablePreInspectionReportsQuery } from '../reports/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../reports/ReportListItem'
import Report from '../reports/Report'
import { TextButton } from '../common/components/Button'

const PreInspectionReportsView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

export type PropTypes = {
  children?: React.ReactNode
}

const PreInspectionReports: React.FC<PropTypes> = observer(() => {
  const [reportsExpanded, setReportsExpanded] = useState(false)

  const toggleReportsExpanded = useCallback(() => {
    setReportsExpanded((currentVal) => !currentVal)
  }, [])

  let preInspection = useContext(PreInspectionContext)

  let { data: reportsData, loading: reportsLoading } = useQueryData(
    availablePreInspectionReportsQuery,
    {
      skip: !preInspection,
      variables: {
        preInspectionId: preInspection?.id,
      },
    }
  )

  let reports = useMemo(() => reportsData || [], [reportsData])

  return (
    <PreInspectionReportsView>
      <FlexRow>
        {reports.length !== 0 && (
          <TextButton onClick={toggleReportsExpanded}>
            {reportsExpanded ? 'Piilota kaikki raportit' : 'Näytä kaikki raportit'}
          </TextButton>
        )}
      </FlexRow>
      {!preInspection && <ErrorView>Ennakkotarkastus ei löydetty.</ErrorView>}
      {!!preInspection && !reportsData && !reportsLoading && (
        <MessageView>Ei raportteja...</MessageView>
      )}
      <LoadingDisplay loading={reportsLoading} />
      {preInspection &&
        reports.map((reportItem) => (
          <ReportListItem
            key={reportItem.name}
            reportData={reportItem}
            isExpanded={reportsExpanded}>
            <Report reportName={reportItem.name} inspectionId={preInspection?.id || ''} />
          </ReportListItem>
        ))}
    </PreInspectionReportsView>
  )
})

export default PreInspectionReports
