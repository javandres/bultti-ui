import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Report, ReportInput } from '../schema-types'
import ItemForm from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import { modifyReportMutation } from './reportQueries'
import { TextArea, TextInput } from '../common/input/Input'

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

const renderEditorField = (key: string, val: any, onChange: (val: any) => void) => {
  if (key === 'description') {
    return (
      <TextArea
        value={val}
        theme="light"
        onChange={(e) => onChange(e.target.value)}
        name={key}
        style={{ width: '100%' }}
      />
    )
  }

  return (
    <TextInput
      type="text"
      theme="light"
      value={val}
      onChange={(e) => onChange(e.target.value)}
      name={key}
    />
  )
}

let formLabels = {
  name: 'Tunniste',
  title: 'Nimi',
  description: 'Kuvaus',
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
      <ItemForm
        item={pendingReport}
        hideKeys={['id', 'columnLabels', 'params', 'inspectionTypes', 'reportType']}
        labels={formLabels}
        onChange={onChange}
        onDone={onDone}
        onCancel={onCancel}
        frameless={true}
        renderInput={renderEditorField}
      />
    </ReportEditorView>
  )
})

export default ReportEditor
