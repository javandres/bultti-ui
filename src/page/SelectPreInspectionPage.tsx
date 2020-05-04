import React, { useCallback } from 'react'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { PreInspection } from '../schema-types'
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

  let { data: preInspections, loading, refetch } = useQueryData<PreInspection>(
    currentPreInspectionsByOperatorAndSeasonQuery,
    {
      skip: !operator || !season,
      notifyOnNetworkStatusChange: true,
      variables: {
        operatorId: operator?.id,
        seasonId: typeof season === 'string' ? season : season?.id,
      },
    }
  )

  let onSelectPreInspection = useCallback(
    (preInspection) => {
      if (preInspection?.id) {
        editPreInspection(preInspection.id)
      }
    },
    [editPreInspection]
  )

  return (
    <Page>
      <PageTitle>Valitse ennakkotarkastus muokattavaksi</PageTitle>
      <SelectPreInspection
        preInspections={preInspections}
        refetchPreInspections={refetch}
        loading={loading}
        onSelect={onSelectPreInspection}
      />
    </Page>
  )
})

export default SelectPreInspectionPage
