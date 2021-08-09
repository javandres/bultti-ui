import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components/macro'
import { useQueryData } from '../util/useQueryData'
import { sortBy } from 'lodash'
import { reportsQuery } from '../report/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../report/ReportListItem'
import InspectionItem from './InspectionItem'
import { ErrorView, MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import type { ReportListItem as ReportListItemType } from '../schema-types'
import { Inspection } from '../schema-types'
import { getInspectionTypeStrings } from './inspectionUtils'
import ReportContainer from '../report/ReportContainer'
import { ReportTypeByName } from '../report/reportTypes'

type ReportTypeNames = keyof ReportTypeByName
const preInspectionReportOrder: ReportTypeNames[] = [
  'missingEquipmentReport',
  'extraBlockDeparturesReport',
  'missingBlockDeparturesReport',
  'blockDeviationsReport',
  'allDeviationsReport',
  'equipmentTypeReport',
  'equipmentColorReport',
  'overageDeparturesReport',
  'unitExecutionReport',
  'executionRequirementsReport',
  'emissionClassExecutionReport',
  'operatorDeadrunsReport',
  'deadrunsReport',
  'trackedDeparturesReport',
  'departureBlocksReport',
]
const postInspectionReportOrder: ReportTypeNames[] = [
  'sanctionSummaryReport',
  'sanctionListReport',
  'observedEquipmentTypeReport',
  'observedEquipmentColorReport',
  'observedOverageDeparturesReport',
  'observedUnitExecutionReport',
  'observedExecutionRequirementsReport',
  'observedEmissionClassExecutionReport',
  'observedLateDeparturesReport',
  'earlyTimingStopDeparturesReport',
  'unobservedDeparturesReport',
]

const InspectionReportsView = styled.div`
  min-height: 100%;
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
  inspection: Inspection
}

const InspectionReports = observer(
  ({ showInfo = true, showItemActions = true, inspection }: PropTypes) => {
    let inspectionId = inspection?.id || ''

    let { data: reportsData, loading: reportsLoading } = useQueryData<ReportListItemType[]>(
      reportsQuery,
      {
        variables: {
          inspectionType: inspection.inspectionType,
          inspectionId: inspectionId,
        },
      }
    )

    let reports: ReportListItemType[] = useMemo(
      () =>
        sortReportsBySpecificOrder(
          reportsData,
          inspection.inspectionType === 'PRE'
            ? preInspectionReportOrder
            : postInspectionReportOrder
        ) || [],
      [reportsData]
    )
    let typeStrings = getInspectionTypeStrings(inspection.inspectionType)

    return (
      <InspectionReportsView data-cy="inspection_reports">
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
        <LoadingDisplay loading={reportsLoading} />
        {inspection &&
          reports.map((reportListItem) => (
            <ReportListItem
              key={reportListItem.name}
              testId={`inspection_reports_report_section_${reportListItem.name}`}
              inspectionType={showItemActions ? inspection.inspectionType! : undefined}
              inspectionId={showItemActions ? inspectionId : undefined}
              reportData={reportListItem}>
              <ReportContainer
                testId={`inspection_reports_report_${reportListItem.name}`}
                reportName={reportListItem.name as keyof ReportTypeByName}
                inspectionId={inspectionId}
                inspectionType={inspection.inspectionType}
                inspectionStatus={inspection.status}
              />
            </ReportListItem>
          ))}
      </InspectionReportsView>
    )
  }
)

export default InspectionReports

function sortReportsBySpecificOrder(
  reports: ReportListItemType[],
  reportOrder: ReportTypeNames[]
) {
  return sortBy(reports, (report: ReportListItemType) => {
    return reportOrder.indexOf(`${report.name}Report` as ReportTypeNames)
  })
}
