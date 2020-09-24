import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Report, ReportInput } from '../schema-types'
import ItemForm, { FieldValueDisplay } from '../common/input/ItemForm'
import { useMutationData } from '../util/useMutationData'
import {
  createReportMutation,
  modifyReportMutation,
  reportCreatorNamesQuery,
  reportsQuery,
} from './reportQueries'
import { TextArea, TextInput } from '../common/input/Input'
import { useQueryData } from '../util/useQueryData'
import AutoComplete from '../common/input/AutoCompleteInput'
import KeyValueInput, { ValuesType } from '../common/input/KeyValueInput'
import { difference } from 'lodash'

const ReportEditorView = styled.div``

export type PropTypes = {
  report: Report
  onCancel?: () => unknown
  isNew?: boolean
  existingNames?: string[]
  readOnly: boolean
}

function createReportInput(report: Report): ReportInput {
  return {
    id: report.id,
    description: report.description,
    name: report.name,
    title: report.title,
    params: report.params || '',
    order: report.order || 0,
    inspectionTypes: Object.values(report.inspectionTypes || {}).join(', ') || '',
  }
}

const renderEditorField = (reportCreatorNames: string[] = [], defaultParams = {}) => (
  key: string,
  val: any,
  onChange: (val: any) => void,
  readOnly: boolean
) => {
  if (key === 'params') {
    let values = !!val ? JSON.parse(val) : {}
    let changeHandler = (values: ValuesType) => onChange(JSON.stringify(values))

    return (
      <KeyValueInput
        readOnly={readOnly}
        values={values}
        onChange={changeHandler}
        readOnlyKeys={Object.keys(defaultParams)}
      />
    )
  }

  if (key === 'name') {
    return (
      <AutoComplete
        disabled={readOnly}
        selectedItem={val}
        items={reportCreatorNames}
        onSelect={onChange}
        itemToString={(item) => item}
        itemToLabel={(item) => item}
      />
    )
  }

  if (readOnly) {
    return <FieldValueDisplay>{val}</FieldValueDisplay>
  }

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
  params: 'Parametrit',
  inspectionTypes: 'Tarkastustyyppi',
}

const ReportEditor = observer(
  ({ report, onCancel, isNew = false, existingNames = [], readOnly }: PropTypes) => {
    let [pendingReport, setPendingReport] = useState(createReportInput(report))

    let pendingReportValid = useMemo(() => !!pendingReport.name && !!pendingReport.title, [
      pendingReport,
    ])

    let onChange = useCallback((key, nextValue) => {
      setPendingReport((currentVal) => ({
        ...currentVal,
        [key]: nextValue,
      }))
    }, [])

    let [modifyReport, { data: nextReport, loading: modifyLoading }] = useMutationData(
      modifyReportMutation
    )

    let [createReport, { loading: createLoading }] = useMutationData(createReportMutation, {
      update: (cache, { data: { createReport } }) => {
        let { reports } = cache.readQuery({ query: reportsQuery }) || {}

        cache.writeQuery({
          query: reportsQuery,
          data: { reports: [...reports, createReport] },
        })
      },
    })

    let isLoading = modifyLoading || createLoading

    useEffect(() => {
      if (nextReport && !isLoading) {
        setPendingReport(createReportInput(nextReport))
      }
    }, [nextReport])

    let onDone = useCallback(async () => {
      if (pendingReportValid) {
        let mutationFn = isNew ? createReport : modifyReport

        await mutationFn({
          variables: {
            reportInput: pendingReport,
          },
        })

        if (isNew && onCancel) {
          onCancel()
        }
      }
    }, [pendingReport, pendingReportValid, onCancel, isNew])

    let onCancelEdit = useCallback(() => {
      setPendingReport(createReportInput(report))

      if (onCancel) {
        onCancel()
      }
    }, [report, onCancel])

    let { data: reportCreatorsData } = useQueryData(reportCreatorNamesQuery)

    let reportCreatorNames = useMemo(
      () =>
        difference(
          (reportCreatorsData || []).map(({ name }) => name),
          existingNames
        ),
      [existingNames, reportCreatorsData]
    )

    let defaultParams = useMemo(() => JSON.parse(report?._defaultParams || '{}'), [report])

    return (
      <ReportEditorView>
        <ItemForm
          item={pendingReport}
          hideKeys={['id', 'reportType', 'order']}
          labels={formLabels}
          onChange={onChange}
          onDone={onDone}
          onCancel={onCancelEdit}
          frameless={true}
          loading={isLoading}
          readOnly={readOnly}
          doneDisabled={!pendingReportValid}
          renderInput={renderEditorField(reportCreatorNames, defaultParams)}
        />
      </ReportEditorView>
    )
  }
)

export default ReportEditor
