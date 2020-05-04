import React, { useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, flatten, groupBy, pick } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import {
  defaultDayTypeGroup,
  getEnabledDayTypes,
  useDayTypeGroups,
} from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'
import { useQueryData } from '../util/useQueryData'
import { departureBlocksQuery } from './departureBlocksQuery'
import { DayType, OperatorBlockDeparture } from '../schema-types'
import { normalDayTypes } from '../constants'
import { PageSection, SectionTopBar } from '../common/components/common'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useRefetch } from '../util/useRefetch'

const DepartureBlocksView = styled(PageSection)`
  margin-bottom: 0;
`

type PropTypes = {}

const DepartureBlocks: React.FC<PropTypes> = observer(() => {
  const preInspection = useContext(PreInspectionContext)
  const preInspectionId = preInspection?.id || ''

  // Create day type groups with the special hook. Day type groups are departure blocks grouped by dayType.
  // The hook contains logic to select and deselect the dayTypes.
  let [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeToGroup, removeDayTypeFromGroup, addDayTypeGroup },
  ] = useDayTypeGroups()

  // The main query that fetches the departure blocks.
  let { data: blockDepartureData, loading: departureBlocksLoading, refetch } = useQueryData(
    departureBlocksQuery,
    {
      notifyOnNetworkStatusChange: true,
      skip: !preInspectionId,
      variables: {
        preInspectionId: preInspectionId,
      },
    }
  )

  // Group blocks by dayType.
  let departureDayTypeBlocks = useMemo(() => groupBy(blockDepartureData || [], 'dayType'), [
    blockDepartureData,
  ])

  // Figure out which day types are selectable. The day type is selectable (or unselectable)
  // when it doesn't have any blocks attached to it.
  let selectableDayTypes = useMemo(() => {
    let dayTypesWithBlocks = Object.keys(departureDayTypeBlocks)
    return normalDayTypes.filter((dt) => !dayTypesWithBlocks.includes(dt))
  }, [departureDayTypeBlocks])

  // Callback for when the block configuration changes, which will update the blocks query.
  // Called from each day type group item.
  let onBlocksChange = useRefetch(refetch)

  // Add a new dayType group for each departure block group
  // if the dayYpe doesn't already exist in a group.
  useEffect(() => {
    for (let dayType of Object.keys(departureDayTypeBlocks)) {
      if (!enabledDayTypes.includes(dayType)) {
        addDayTypeGroup(dayType as DayType)
      }
    }
  }, [departureDayTypeBlocks, enabledDayTypes])

  return (
    <DepartureBlocksView>
      <SectionTopBar>
        {(blockDepartureData || []).length !== 0 && (
          <Button
            loading={departureBlocksLoading}
            style={{ marginLeft: 'auto' }}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSize.SMALL}
            onClick={() => refetch()}>
            Päivitä
          </Button>
        )}
      </SectionTopBar>
      {dayTypeGroups.map((dayTypeGroup, groupIndex) => {
        let dayTypeBlocks = pick(departureDayTypeBlocks, getEnabledDayTypes(dayTypeGroup))
        let departureBlocksForDayTypes: OperatorBlockDeparture[] = flatten(
          Object.values(dayTypeBlocks)
        )

        return (
          <DepartureBlockGroupItem
            key={`dayTypeGroup-${groupIndex}`}
            loading={departureBlocksLoading}
            selectableDayTypes={selectableDayTypes}
            departures={departureBlocksForDayTypes}
            dayTypeGroup={dayTypeGroup}
            groupIndex={groupIndex}
            onAddDayType={addDayTypeToGroup}
            onRemoveDayType={removeDayTypeFromGroup}
            onBlocksChange={onBlocksChange}
          />
        )
      })}

      {difference(Object.keys(defaultDayTypeGroup), enabledDayTypes).length !== 0 && (
        <div>
          <Button onClick={() => addDayTypeGroup()}>Lisää päiväryhmä</Button>
        </div>
      )}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
