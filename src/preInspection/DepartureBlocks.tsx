import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, flatten, groupBy, pick } from 'lodash'
import { Button } from '../common/components/Button'
import { defaultDayTypeGroup, getEnabledDayTypes, useDayTypeGroups } from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'
import { useQueryData } from '../util/useQueryData'
import { departureBlocksQuery } from './departureBlocksQuery'
import { DepartureBlock } from '../schema-types'

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

  let { data: departureBlocksData, loading: departureBlocksLoading } = useQueryData(
    departureBlocksQuery,
    {
      skip: !inspectionId,
      variables: {
        preInspectionId: inspectionId,
      },
    }
  )

  console.log(departureBlocksData)

  let departureBlockGroups = useMemo(() => groupBy(departureBlocksData || [], 'dayType'), [
    departureBlocksData,
  ])

  return (
    <DepartureBlocksView>
      {dayTypeGroups.map((dayTypeGroup, groupIndex) => {
        let dayTypeBlocks = pick(departureBlockGroups, getEnabledDayTypes(dayTypeGroup))
        let departureBlocksForDayTypes: DepartureBlock[] = flatten(Object.values(dayTypeBlocks))

        return (
          <DepartureBlockGroupItem
            key={`dayTypeGroup-${groupIndex}`}
            departureBlocks={departureBlocksForDayTypes}
            inspectionId={inspectionId}
            dayTypeGroup={dayTypeGroup}
            groupIndex={groupIndex}
            onAddDayType={addDayTypeToGroup}
            onRemoveDayType={removeDayTypeFromGroup}
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
