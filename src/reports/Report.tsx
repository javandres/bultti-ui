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
import PairListReport from './PairListReport'

const ReportView = styled.div`
  position: relative;
  min-height: 10rem;
`

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 1rem;
`

export type PropTypes = {
  reportName: string
  inspectionType: InspectionType
  inspectionId: string
}

const Report = observer(({ reportName, inspectionId, inspectionType }: PropTypes) => {
  let { data: reportData, loading: reportLoading, refetch } = useQueryData<ReportDataType>(
    reportByName,
    {
      notifyOnNetworkStatusChange: true,
      skip: !inspectionId || !reportName,
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

    let labels = reportData?.columnLabels ? JSON.parse(reportData?.columnLabels) : undefined

    switch (reportData?.reportType) {
      case ReportTypeEnum.List:
        return <ListReport items={reportDataItems} columnLabels={labels} />
      case ReportTypeEnum.PairList:
        return <PairListReport items={reportDataItems} columnLabels={labels} />
      case ReportTypeEnum.ExecutionRequirement:
        return <ExecutionRequirementsReport items={reportDataItems} />
      default:
        return <></>
    }
  }, [reportData])

  return (
    <ReportView>
      <ReportFunctionsRow>
        {inspectionType && inspectionId && (
          <DownloadReport
            reportName={reportName}
            inspectionId={inspectionId}
            inspectionType={inspectionType}
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
      <LoadingDisplay loading={reportLoading} style={{ top: '-1rem' }} />
      {reportData && ReportTypeComponent}
    </ReportView>
  )
})

export default Report
