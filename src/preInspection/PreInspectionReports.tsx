import React, { useCallback, useContext, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PreInspectionContext } from './PreInspectionContext'
import styled from 'styled-components'
import { useQueryData } from '../util/useQueryData'
import { reportsQuery } from '../reports/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../reports/ReportListItem'
import Report from '../reports/Report'
import { TextButton } from '../common/components/Button'
import PreInspectionItem from './PreInspectionItem'
import { ErrorView, MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import { InspectionType } from '../schema-types'

const PreInspectionReportsView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
  position: relative;
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
  showItemActions?: boolean
}

const PreInspectionReports = observer(
  ({ showInfo = true, showItemActions = true }: PropTypes) => {
    const [reportsExpanded, setReportsExpanded] = useState(false)

    const toggleReportsExpanded = useCallback(() => {
      setReportsExpanded((currentVal) => !currentVal)
    }, [])

    let inspection = useContext(PreInspectionContext)
    let inspectionId = inspection?.id || ''

    let { data: reportsData, loading: reportsLoading } = useQueryData(reportsQuery, {
      variables: {
        inspectionType: InspectionType.Pre,
      },
    })

    let reports = useMemo(() => reportsData || [], [reportsData])

    return (
      <PreInspectionReportsView>
        {!inspection && <ErrorView>Ennakkotarkastus ei löydetty.</ErrorView>}
        {!!inspection && !reportsData && !reportsLoading && (
          <MessageView>Ei raportteja...</MessageView>
        )}
        {showInfo && inspection && (
          <>
            <SubHeading>Ennakkotarkastuksen tiedot</SubHeading>
            <ReportPreInspectionView inspection={inspection} showActions={false} />
          </>
        )}
        {reports.length !== 0 && (
          <TextButton onClick={toggleReportsExpanded}>
            {reportsExpanded ? 'Piilota kaikki raportit' : 'Näytä kaikki raportit'}
          </TextButton>
        )}
        <LoadingDisplay loading={reportsLoading} />
        {inspection &&
          reports.map((reportItem) => (
            <ReportListItem
              key={reportItem.name}
              inspectionType={showItemActions ? InspectionType.Pre : undefined}
              inspectionId={showItemActions ? inspectionId : undefined}
              reportData={reportItem}
              isExpanded={reportsExpanded}>
              <Report
                reportName={reportItem.name}
                inspectionId={inspectionId}
                inspectionType={InspectionType.Pre}
              />
            </ReportListItem>
          ))}
      </PreInspectionReportsView>
    )
  }
)

export default PreInspectionReports
