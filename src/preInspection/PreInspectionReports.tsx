import React, { useCallback, useContext, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PreInspectionContext } from './PreInspectionContext'
import styled from 'styled-components'
import { useQueryData } from '../util/useQueryData'
import { availablePreInspectionReportsQuery } from '../reports/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../reports/ReportListItem'
import Report from '../reports/Report'
import { TextButton } from '../common/components/Button'
import PreInspectionItem from './PreInspectionItem'
import { ErrorView, MessageView } from '../common/components/Messages'
import { SubSectionHeading } from '../common/components/Typography'

const PreInspectionReportsView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

const ReportPreInspectionView = styled(PreInspectionItem)`
  margin-bottom: 2rem;
  margin-right: 0;
  border: 0;
  padding: 0;

  & > * {
    margin-bottom: 0;
  }
`

export type PropTypes = {
  showInfo?: boolean
}

const PreInspectionReports = observer(({ showInfo = true }: PropTypes) => {
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
      {!preInspection && <ErrorView>Ennakkotarkastus ei löydetty.</ErrorView>}
      {!!preInspection && !reportsData && !reportsLoading && (
        <MessageView>Ei raportteja...</MessageView>
      )}
      {showInfo && preInspection && (
        <>
          <SubSectionHeading>Ennakkotarkastuksen tiedot</SubSectionHeading>
          <ReportPreInspectionView preInspection={preInspection} showActions={false} />
        </>
      )}
      {reports.length !== 0 && (
        <TextButton onClick={toggleReportsExpanded}>
          {reportsExpanded ? 'Piilota kaikki raportit' : 'Näytä kaikki raportit'}
        </TextButton>
      )}
      <LoadingDisplay loading={reportsLoading} />
      {preInspection &&
        reports.map((reportItem) => (
          <ReportListItem
            key={reportItem.name}
            reportData={reportItem}
            isExpanded={reportsExpanded}>
            <Report reportName={reportItem.name} preInspectionId={preInspection?.id || ''} />
          </ReportListItem>
        ))}
    </PreInspectionReportsView>
  )
})

export default PreInspectionReports
