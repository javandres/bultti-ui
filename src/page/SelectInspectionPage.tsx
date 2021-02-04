import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Page, PageContainer } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Inspection, InspectionType } from '../schema-types'
import SelectInspection from '../inspection/SelectInspection'
import { currentPreInspectionsByOperatorAndSeasonQuery } from '../inspection/inspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { PageTitle } from '../common/components/PageTitle'
import { getInspectionTypeStrings } from '../inspection/inspectionUtils'

export type PropTypes = {
  inspectionType: InspectionType
} & RouteComponentProps

const SelectInspectionPage: React.FC<PropTypes> = observer(({ inspectionType }) => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let { data: inspections, loading, refetch } = useQueryData<Inspection[]>(
    currentPreInspectionsByOperatorAndSeasonQuery,
    {
      skip: !operator?.id || !season?.id,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.id || 0,
        seasonId: (typeof season === 'string' ? season : season?.id) || '',
        inspectionType,
      },
    }
  )

  let typeStrings = getInspectionTypeStrings(inspectionType)

  return (
    <Page>
      <PageTitle loading={loading} onRefresh={refetch}>
        Valitse {typeStrings.prefixLC}tarkastus muokattavaksi
      </PageTitle>
      <PageContainer>
        <SelectInspection
          inspections={inspections}
          inspectionType={inspectionType}
          refetchInspections={refetch}
          loading={loading}
        />
      </PageContainer>
    </Page>
  )
})

export default SelectInspectionPage
