import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { reportByName } from './reportQueries'
import { Report as ReportDataType, ReportType as ReportTypeEnum } from '../schema-types'
import ListReport from './ListReport'
import { LoadingDisplay } from '../common/components/Loading'
import ExecutionRequirementsReport from './ExecutionRequirementsReport'

const ReportView = styled.div``

export type PropTypes = {
  reportName: string
  inspectionId: string
}

const Report = observer(({ reportName, inspectionId }: PropTypes) => {
  let { data: reportData, loading: reportLoading } = useQueryData<ReportDataType>(
    reportByName,
    {
      skip: !inspectionId || !reportName,
      variables: {
        reportName: reportName,
        inspectionId: inspectionId,
      },
    }
  )

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

  return (
    <ReportView>
      <LoadingDisplay loading={reportLoading} />
      {reportData && reportData?.reportEntities?.length !== 0 && ReportTypeComponent}
    </ReportView>
  )
})

export default Report
