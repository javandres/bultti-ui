import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Report, Report, ReportInput } from '../schema-types'
import ItemForm from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import { modifyReportMutation } from '../common/query/authQueries'

const ReportEditorView = styled.div``

export type PropTypes = {
  report: Report
}

function createReportInput(report: Report): ReportInput {
  return {
    id: report.id,
    description: report.description,
    name: report.name,
    title: report.title,
  }
}

const ReportEditor = observer(({ report }: PropTypes) => {
  let [pendingReport, setPendingReport] = useState(createReportInput(report))

  let onChange = useCallback((key, nextValue) => {
    setPendingReport((currentVal) => ({
      ...currentVal,
      [key]: nextValue,
    }))
  }, [])

  let [modifyReport, { data: nextReport, loading: reportLoading }] = useMutationData(
    modifyReportMutation
  )

  useEffect(() => {
    if (nextReport && !reportLoading) {
      setReport(nextReport)
      setPendingReport(createReportInput(nextReport))
    }
  }, [nextReport])

  let onDone = useCallback(() => {
    modifyReport({
      variables: {
        reportInput: pendingReport,
      },
    })
  }, [pendingReport])

  let onCancel = useCallback(() => {
    setPendingReport(createReportInput(report))
  }, [])

  return (
    <ReportEditorView>
      <ItemForm item={report} hideKeys={['id', 'columnLabels', 'params']} />
    </ReportEditorView>
  )
})

export default ReportEditor
