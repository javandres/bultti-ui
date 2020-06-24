import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Inspection, InspectionType } from '../schema-types'
import SelectPreInspection from '../preInspection/SelectPreInspection'
import { currentPreInspectionsByOperatorAndSeasonQuery } from '../preInspection/preInspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { PageTitle } from '../common/components/PageTitle'

export type PropTypes = {} & RouteComponentProps

const SelectPreInspectionPage: React.FC<PropTypes> = observer(() => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')

  let { data: inspections, loading, refetch } = useQueryData<Inspection>(
    currentPreInspectionsByOperatorAndSeasonQuery,
    {
      skip: !operator?.id || !season?.id,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.id || 0,
        seasonId: (typeof season === 'string' ? season : season?.id) || '',
        inspectionType: InspectionType.Pre,
      },
    }
  )

  return (
    <Page>
      <PageTitle loading={loading} onRefresh={refetch}>
        Valitse ennakkotarkastus muokattavaksi
      </PageTitle>
      <SelectPreInspection
        inspections={inspections}
        refetchPreInspections={refetch}
        loading={loading}
      />
    </Page>
  )
})

export default SelectPreInspectionPage
