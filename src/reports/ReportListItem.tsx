import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  PreInspection,
  Report,
  ReportListItem as ReportListItemType,
  ReportType,
} from '../schema-types'
import ExpandableSection, { HeaderSection } from '../common/components/ExpandableSection'
import { useQueryData } from '../util/useQueryData'
import { reportByName } from './reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ListReport from './ListReport'

const ReportTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0.75rem;
`

const ReportDescription = styled.p`
  margin-bottom: 0;
`

export type PropTypes = {
  reportItem: ReportListItemType
  preInspection: PreInspection
}

const ReportListItem: React.FC<PropTypes> = observer(({ preInspection, reportItem }) => {
  let { data: reportData, loading: reportLoading } = useQueryData<Report>(reportByName, {
    variables: {
      reportName: reportItem.name,
      preInspectionId: preInspection?.id,
    },
  })

  let ReportTypeComponent = useMemo(() => {
    switch (reportItem.reportType) {
      case ReportType.List:
        return ListReport
      default:
        return ListReport
    }
  }, [reportItem.reportType])

  let labels = useMemo(
    () => (reportData?.columnLabels ? JSON.parse(reportData?.columnLabels) : undefined),
    [reportData]
  )

  return (
    <ExpandableSection
      headerContent={
        <>
          <HeaderSection>
            <ReportTitle>{reportItem.name}</ReportTitle>
            <ReportDescription>{reportItem.description}</ReportDescription>
          </HeaderSection>
        </>
      }>
      <>
        <LoadingDisplay loading={reportLoading} />
        {reportData && reportData?.reportEntities?.length !== 0 && (
          <ReportTypeComponent
            items={reportData.reportEntities.slice(0, 100)}
            columnLabels={labels}
          />
        )}
      </>
    </ExpandableSection>
  )
})

export default ReportListItem
