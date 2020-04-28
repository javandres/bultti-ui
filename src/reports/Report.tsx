import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { reportByName } from './reportQueries'
import {
  InspectionType,
  Report as ReportDataType,
  ReportType as ReportTypeEnum,
} from '../schema-types'
import ListReport from './ListReport'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import { useRefetch } from '../util/useRefetch'
import DownloadReport from './DownloadReport'

const ReportView = styled.div``

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 1rem;
`

export type PropTypes = {
  reportName: string
  preInspectionId?: string
  postInspectionId?: string
}

const Report = observer(({ reportName, preInspectionId, postInspectionId }: PropTypes) => {
  // Decide which type of report to query for based on which ID was provided.
  let inspectionId = preInspectionId || postInspectionId || undefined
  let inspectionType = preInspectionId
    ? InspectionType.Pre
    : postInspectionId
    ? InspectionType.Post
    : undefined

  let { data: reportData, loading: reportLoading, refetch } = useQueryData<ReportDataType>(
    reportByName,
    {
      notifyOnNetworkStatusChange: true,
      skip: !inspectionType || !inspectionId || !reportName,
      variables: {
        reportName: reportName,
        inspectionId,
        inspectionType,
      },
    }
  )

  let queueRefetch = useRefetch(refetch, false)

  let ReportTypeComponent = useMemo(() => {
    let reportDataItems = reportData?.reportEntities || []

    switch (reportData?.reportType) {
      case ReportTypeEnum.List:
        let labels = reportData?.columnLabels
          ? JSON.parse(reportData?.columnLabels)
          : undefined
        return <ListReport items={reportDataItems} columnLabels={labels} />
      case ReportTypeEnum.ExecutionRequirement:
        return <ExecutionRequirementsReport items={reportDataItems} />
      default:
        return <></>
    }
  }, [reportData])

  let inspectionTypeStr: 'preinspection' | 'postInspection' | undefined =
    inspectionType === InspectionType.Pre
      ? 'preinspection'
      : inspectionType === InspectionType.Post
      ? 'postInspection'
      : undefined

  return (
    <ReportView>
      <ReportFunctionsRow>
        {inspectionTypeStr && inspectionId && (
          <DownloadReport
            reportName={reportName}
            inspectionId={inspectionId}
            inspectionType={inspectionTypeStr}
          />
        )}
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={queueRefetch}>
          Päivitä
        </Button>
      </ReportFunctionsRow>
      <LoadingDisplay loading={reportLoading} />
      {reportData && ReportTypeComponent}
    </ReportView>
  )
})

export default Report
