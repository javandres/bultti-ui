import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import PreInspectionReports from '../preInspection/PreInspectionReports'
import { useInspectionById } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'

type PropTypes = {
  inspectionId?: string
} & RouteComponentProps

const PreInspectionReportsPage: React.FC<PropTypes> = observer(({ inspectionId }) => {
  let { data: inspection, loading: inspectionLoading, refetch } = useInspectionById(
    inspectionId
  )

  return (
    <Page>
      <PageTitle loading={inspectionLoading} onRefresh={refetch}>
        Ennakkotarkastuksen raportit
      </PageTitle>
      <PreInspectionContext.Provider value={inspection}>
        <PreInspectionReports />
      </PreInspectionContext.Provider>
    </Page>
  )
})

export default PreInspectionReportsPage
