import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, flatten, groupBy, pick } from 'lodash'
import { Button } from '../common/components/Button'
import { defaultDayTypeGroup, getEnabledDayTypes, useDayTypeGroups } from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'
import { useQueryData } from '../util/useQueryData'
import { departureBlocksQuery } from './departureBlocksQuery'
import { DayType, DepartureBlock } from '../schema-types'
import { normalDayTypes } from '../constants'

const DepartureBlocksView = styled.div`
  margin-bottom: 0;
`

type PropTypes = {
  inspectionId: string
}

const DepartureBlocks: React.FC<PropTypes> = observer(({ inspectionId }) => {
  let [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeToGroup, removeDayTypeFromGroup, addDayTypeGroup },
  ] = useDayTypeGroups()

  let { data: departureBlocksData, loading: departureBlocksLoading, refetch } = useQueryData(
    departureBlocksQuery,
    {
      notifyOnNetworkStatusChange: true,
      skip: !inspectionId,
      variables: {
        preInspectionId: inspectionId,
      },
    }
  )

  let departureBlockGroups = useMemo(() => groupBy(departureBlocksData || [], 'dayType'), [
    departureBlocksData,
  ])

  let selectableDayTypes = useMemo(() => {
    let dayTypesWithBlocks = Object.keys(departureBlockGroups)
    return normalDayTypes.filter((dt) => !dayTypesWithBlocks.includes(dt))
  }, [departureBlockGroups])

  let onBlocksChange = useCallback(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    for (let dayType of Object.keys(departureBlockGroups)) {
      if (!enabledDayTypes.includes(dayType)) {
        addDayTypeGroup(dayType as DayType)
      }
    }
  }, [departureBlockGroups, enabledDayTypes])

  return (
    <DepartureBlocksView>
      {dayTypeGroups.map((dayTypeGroup, groupIndex) => {
        let dayTypeBlocks = pick(departureBlockGroups, getEnabledDayTypes(dayTypeGroup))
        let departureBlocksForDayTypes: DepartureBlock[] = flatten(Object.values(dayTypeBlocks))

        return (
          <DepartureBlockGroupItem
            key={`dayTypeGroup-${groupIndex}`}
            loading={departureBlocksLoading}
            selectableDayTypes={selectableDayTypes}
            departureBlocks={departureBlocksForDayTypes}
            inspectionId={inspectionId}
            dayTypeGroup={dayTypeGroup}
            groupIndex={groupIndex}
            onAddDayType={addDayTypeToGroup}
            onRemoveDayType={removeDayTypeFromGroup}
            onBlocksChange={onBlocksChange}
          />
        )
      })}
      {difference(Object.keys(defaultDayTypeGroup), enabledDayTypes).length !== 0 && (
        <Button onClick={() => addDayTypeGroup()}>Lisää päiväryhmä</Button>
      )}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
