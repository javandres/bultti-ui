import React, { useCallback } from 'react'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { Inspection, InspectionType } from '../schema-types'
import SelectPreInspection from '../preInspection/SelectPreInspection'
import { currentPreInspectionsByOperatorAndSeasonQuery } from '../preInspection/preInspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { useEditPreInspection } from '../preInspection/preInspectionUtils'
import { PageTitle } from '../common/components/Typography'

export type PropTypes = {} & RouteComponentProps

const SelectPreInspectionPage: React.FC<PropTypes> = observer(() => {
  var [season] = useStateValue('globalSeason')
  var [operator] = useStateValue('globalOperator')
  var editPreInspection = useEditPreInspection()

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

  let onSelectPreInspection = useCallback(
    (inspection) => {
      if (inspection?.id) {
        editPreInspection(inspection.id)
      }
    },
    [editPreInspection]
  )

  return (
    <Page>
      <PageTitle>Valitse ennakkotarkastus muokattavaksi</PageTitle>
      <SelectPreInspection
        inspections={inspections}
        refetchPreInspections={refetch}
        loading={loading}
        onSelect={onSelectPreInspection}
      />
    </Page>
  )
})

export default SelectPreInspectionPage
