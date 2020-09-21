import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useQueryData } from '../util/useQueryData'
import { reportsQuery } from '../report/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../report/ReportListItem'
import Report from '../report/Report'
import { TextButton } from '../common/components/Button'
import InspectionItem from './InspectionItem'
import { ErrorView, MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import { Inspection, InspectionType } from '../schema-types'
import { getInspectionTypeStrings } from './inspectionUtils'

const InspectionReportsView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
  position: relative;
`

const ReportInspectionView = styled(InspectionItem)`
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
  inspectionType: InspectionType
  inspection: Inspection
}

const InspectionReports = observer(
  ({ showInfo = true, showItemActions = true, inspectionType, inspection }: PropTypes) => {
    const [reportsExpanded, setReportsExpanded] = useState(false)

    const toggleReportsExpanded = useCallback(() => {
      setReportsExpanded((currentVal) => !currentVal)
    }, [])

    let inspectionId = inspection?.id || ''

    let { data: reportsData, loading: reportsLoading } = useQueryData(reportsQuery, {
      variables: {
        inspectionType: inspectionType,
      },
    })

    let reports = useMemo(() => reportsData || [], [reportsData])

    let typeStrings = getInspectionTypeStrings(inspectionType)

    return (
      <InspectionReportsView>
        {!inspection && <ErrorView>{typeStrings.prefix}tarkastus ei löydetty.</ErrorView>}
        {!!inspection && !reportsData && !reportsLoading && (
          <MessageView>Ei raportteja...</MessageView>
        )}
        {showInfo && inspection && (
          <>
            <SubHeading>{typeStrings.prefix}tarkastuksen tiedot</SubHeading>
            <ReportInspectionView
              inspection={inspection}
              inspectionType={inspectionType}
              showActions={false}
            />
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
              inspectionType={showItemActions ? inspectionType : undefined}
              inspectionId={showItemActions ? inspectionId : undefined}
              reportData={reportItem}
              isExpanded={reportsExpanded}>
              <Report
                reportName={reportItem.name}
                inspectionId={inspectionId}
                inspectionType={inspectionType}
              />
            </ReportListItem>
          ))}
      </InspectionReportsView>
    )
  }
)

export default InspectionReports
