import React, { useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { PreInspectionContext } from './PreInspectionContext'
import { ErrorView, MessageView } from '../common/components/common'
import styled from 'styled-components'
import { useQueryData } from '../util/useQueryData'
import { availableReportsQuery } from '../reports/reportQueries'
import { LoadingDisplay } from '../common/components/Loading'
import ReportListItem from '../reports/ReportListItem'

const PreInspectionReportsView = styled.div`
  height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

export type PropTypes = {
  children?: React.ReactNode
}

const PreInspectionReports: React.FC<PropTypes> = observer(() => {
  let preInspection = useContext(PreInspectionContext)

  let { data: reportsData, loading: reportsLoading } = useQueryData(availableReportsQuery, {
    skip: !preInspection,
    variables: {
      preInspectionId: preInspection?.id,
    },
  })

  let reports = useMemo(() => reportsData || [], [reportsData])

  return (
    <PreInspectionReportsView>
      {!preInspection && <ErrorView>Ennakkotarkastus ei löydetty.</ErrorView>}
      {!!preInspection && !reportsData && !reportsLoading && (
        <MessageView>Ei raportteja...</MessageView>
      )}
      <LoadingDisplay loading={reportsLoading} />
      {preInspection &&
        reports.map((reportItem) => (
          <ReportListItem
            key={reportItem.name}
            preInspection={preInspection!}
            reportItem={reportItem}
          />
        ))}
    </PreInspectionReportsView>
  )
})

export default PreInspectionReports
