import React, { useCallback } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import { Page, PageTitle } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { PreInspection } from '../schema-types'
import SelectPreInspection from '../preInspection/SelectPreInspection'
import { currentPreInspectionsByOperatorAndSeasonQuery } from '../preInspection/preInspectionQueries'
import { useQueryData } from '../util/useQueryData'
import { useEditPreInspection } from '../preInspection/useEditPreInspection'

const CreatePreInspectionView = styled(Page)``

export type PropTypes = {} & RouteComponentProps

const SelectEditablePreInspection: React.FC<PropTypes> = observer(() => {
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
        seasonId: season?.id,
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
    <CreatePreInspectionView>
      <PageTitle>Valitse ennakkotarkastus muokattavaksi</PageTitle>
      <SelectPreInspection
        preInspections={preInspections}
        refetchPreInspections={refetch}
        loading={loading}
        onSelect={onSelectPreInspection}
      />
    </CreatePreInspectionView>
  )
})

export default SelectEditablePreInspection
