import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { InitialPreInspectionInput, Operator, PreInspection, Season } from '../schema-types'
import {
  createPreInspectionMutation,
  preInspectionQuery,
  preInspectionsByOperatorAndSeasonQuery,
} from './preInspectionQueries'
import { useMutationData } from '../util/useMutationData'
import { PageLoading } from '../common/components/Loading'

const SelectPreInspectionView = styled.div``

const PreInspectionItem = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: white;
  border: 1px solid var(--blue);
`

export type PropTypes = {
  operator: Operator | null
  season: Season | null
  onSelect: (value: PreInspection | null) => unknown
  currentPreInspection: PreInspection | null
}

/**
 * - Display current in-production pre-inspection
 * - Display current draft pre-inspection
 * - Create a new pre-inspection draft (if no pre-inspection exists for the operator/season combo)
 * - Create a new pre-inspection draft that extends the in-production version
 * - Delete the current draft
 */

const SelectPreInspection: React.FC<PropTypes> = observer(
  ({ operator, season, onSelect, currentPreInspection }) => {
    let { data: preInspectionsData, loading, refetch } = useQueryData<PreInspection>(
      preInspectionsByOperatorAndSeasonQuery,
      {
        skip: !operator || !season,
        notifyOnNetworkStatusChange: true,
        variables: {
          operatorId: operator?.id,
          seasonId: season?.id,
        },
      }
    )

    let [createPreInspection, { loading: createLoading }] = useMutationData(
      createPreInspectionMutation
    )

    // Initialize the form by creating a pre-inspection on the server and getting the ID.
    let createNewPreInspection = useCallback(async () => {
      // A pre-inspection can be created when there is not one currently existing or loading
      if (operator && season && !createLoading) {
        // InitialPreInspectionInput requires operator and season ID.
        let preInspectionInput: InitialPreInspectionInput = {
          operatorId: operator.id,
          seasonId: season.id,
          startDate: season.startDate,
          endDate: season.endDate,
        }

        await createPreInspection({
          variables: {
            preInspectionInput,
          },
        })

        await refetch()
      }
    }, [season, operator, createLoading, refetch])

    let preInspections = useMemo(() => preInspectionsData || [], [preInspectionsData])

    return (
      <SelectPreInspectionView>
        {(loading || createLoading) && <PageLoading />}
        {preInspections.map((preInspection) => (
          <PreInspectionItem key={preInspection.id}>
            Version: {preInspection.version}
            <br />
            Start date: {preInspection.startDate}
            <br />
            End date: {preInspection.endDate}
            <br />
          </PreInspectionItem>
        ))}
      </SelectPreInspectionView>
    )
  }
)

export default SelectPreInspection
