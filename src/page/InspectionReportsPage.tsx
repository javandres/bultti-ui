import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import InspectionReports from '../inspection/InspectionReports'
import { useInspectionById } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'
import { InspectionType } from '../schema-types'

type PropTypes = {
  inspectionId?: string
  inspectionType: InspectionType
} & RouteComponentProps

const InspectionReportsPage: React.FC<PropTypes> = observer(
  ({ inspectionId, inspectionType }) => {
    let { data: inspection, loading: inspectionLoading, refetch } = useInspectionById(
      inspectionId
    )

    return (
      <Page>
        <PageTitle loading={inspectionLoading} onRefresh={refetch}>
          Ennakkotarkastuksen raportit
        </PageTitle>
        {inspection && (
          <InspectionReports inspectionType={inspectionType} inspection={inspection} />
        )}
      </Page>
    )
  }
)

export default InspectionReportsPage
