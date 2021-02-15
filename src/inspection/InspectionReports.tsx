import React, { useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components/macro'
import { useQueryData } from '../util/useQueryData'
import { reportsQuery } from '../report/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../report/ReportListItem'
import { TextButton } from '../common/components/Button'
import InspectionItem from './InspectionItem'
import { ErrorView, MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import { Inspection } from '../schema-types'
import { getInspectionTypeStrings } from './inspectionUtils'
import ReportContainer from '../report/ReportContainer'

const InspectionReportsView = styled.div``

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
  inspection: Inspection
}

const InspectionReports = observer(
  ({ showInfo = true, showItemActions = true, inspection }: PropTypes) => {
    const [reportsExpanded, setReportsExpanded] = useState(false)

    const toggleReportsExpanded = useCallback(() => {
      setReportsExpanded((currentVal) => !currentVal)
    }, [])

    let inspectionId = inspection?.id || ''

    let { data: reportsData, loading: reportsLoading } = useQueryData(reportsQuery, {
      variables: {
        inspectionType: inspection.inspectionType,
      },
    })

    let reports = useMemo(() => reportsData || [], [reportsData])

    let typeStrings = getInspectionTypeStrings(inspection.inspectionType)

    return (
      <InspectionReportsView>
        {!inspection && <ErrorView>{typeStrings.prefix}tarkastus ei löydetty.</ErrorView>}
        {!!inspection && !reportsData && !reportsLoading && (
          <MessageView>Ei raportteja...</MessageView>
        )}
        {showInfo && inspection && (
          <>
            <SubHeading>{typeStrings.prefix}tarkastuksen tiedot</SubHeading>
            <ReportInspectionView inspection={inspection} showActions={false} />
          </>
        )}
        {reports.length !== 0 && (
          <TextButton onClick={toggleReportsExpanded}>
            {reportsExpanded ? 'Piilota kaikki raportit' : 'Näytä kaikki raportit'}
          </TextButton>
        )}
        <LoadingDisplay loading={reportsLoading} />
        {inspection &&
          reports.map((reportListItem) => (
            <ReportListItem
              key={reportListItem.name}
              inspectionType={showItemActions ? inspection.inspectionType! : undefined}
              inspectionId={showItemActions ? inspectionId : undefined}
              reportData={reportListItem}
              isExpanded={reportsExpanded}>
              <ReportContainer
                reportName={reportListItem.name}
                inspectionId={inspectionId}
                inspectionType={inspection.inspectionType}
              />
            </ReportListItem>
          ))}
      </InspectionReportsView>
    )
  }
)

export default InspectionReports
