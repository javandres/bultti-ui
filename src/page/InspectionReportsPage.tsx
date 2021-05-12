import React from 'react'
import { observer } from 'mobx-react-lite'
import { Page, PageContainer } from '../common/components/common'
import InspectionReports from '../inspection/InspectionReports'
import { getInspectionTypeStrings, useInspectionById } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'
import { InspectionType } from '../schema-types'
import { RouteChildrenProps, useParams } from 'react-router-dom'

type PropTypes = {
  inspectionType: InspectionType
} & RouteChildrenProps

const InspectionReportsPage: React.FC<PropTypes> = observer(({ inspectionType }) => {
  let { inspectionId = '' } = useParams<{ inspectionId?: string }>()

  let { data: inspection, loading: inspectionLoading, refetch } = useInspectionById(
    inspectionId
  )

  let typeStrings = getInspectionTypeStrings(inspectionType)

  return (
    <Page>
      <PageTitle loading={inspectionLoading} onRefresh={refetch}>
        {typeStrings.prefix}tarkastuksen raportit
      </PageTitle>
      <PageContainer>
        {inspection && <InspectionReports inspection={inspection} />}
      </PageContainer>
    </Page>
  )
})

export default InspectionReportsPage
