import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Report, ReportInput } from '../schema-types'
import ItemForm from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import { modifyReportMutation, reportCreatorNamesQuery } from './reportQueries'
import { TextArea, TextInput } from '../common/input/Input'
import { useQueryData } from '../util/useQueryData'
import AutoComplete from '../common/input/AutoCompleteInput'
import KeyValueInput, { ValuesType } from '../common/input/KeyValueInput'

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
    params: report.params || '',
  }
}

const renderEditorField = (reportCreatorNames: string[] = [], defaultParams = {}) => (
  key: string,
  val: any,
  onChange: (val: any) => void
) => {
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

  if (key === 'name') {
    return (
      <AutoComplete
        selectedItem={val}
        items={reportCreatorNames}
        onSelect={onChange}
        itemToString={(item) => item}
        itemToLabel={(item) => item}
      />
    )
  }

  if (key === 'params') {
    let values = !!val ? JSON.parse(val) : {}
    let changeHandler = (values: ValuesType) => onChange(JSON.stringify(values))

    return (
      <KeyValueInput
        values={values}
        onChange={changeHandler}
        readOnlyKeys={Object.keys(defaultParams)}
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
  params: 'Parametrit',
}

const ReportEditor = observer(({ report }: PropTypes) => {
  let [pendingReport, setPendingReport] = useState(createReportInput(report))

  let onChange = useCallback((key, nextValue) => {
    setPendingReport((currentVal) => ({
      ...currentVal,
      [key]: nextValue,
    }))
  }, [])

  let [modifyReport, { data: nextReport, loading: mutationLoading }] = useMutationData(
    modifyReportMutation
  )

  useEffect(() => {
    if (nextReport && !mutationLoading) {
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

  let { data: reportCreatorsData } = useQueryData(reportCreatorNamesQuery)

  let reportCreatorNames = (reportCreatorsData || []).map(({ name }) => name)
  let defaultParams = useMemo(() => JSON.parse(report?._defaultParams || '{}'), [report])

  return (
    <ReportEditorView>
      <ItemForm
        item={pendingReport}
        hideKeys={['id', 'inspectionTypes', 'reportType']}
        labels={formLabels}
        onChange={onChange}
        onDone={onDone}
        onCancel={onCancel}
        frameless={true}
        loading={mutationLoading}
        renderInput={renderEditorField(reportCreatorNames, defaultParams)}
      />
    </ReportEditorView>
  )
})

export default ReportEditor
