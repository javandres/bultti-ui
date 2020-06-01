import React, { useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { defaultDayTypeGroup, useDayTypeGroups } from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'
import { useQueryData } from '../util/useQueryData'
import { availableDayTypesQuery } from './blockDeparturesQuery'
import { DayType } from '../schema-types'
import { normalDayTypes } from '../constants'
import { PageSection, SectionTopBar } from '../common/components/common'
import { PreInspectionContext } from '../preInspection/PreInspectionContext'
import { useRefetch } from '../util/useRefetch'

const DepartureBlocksView = styled(PageSection)`
  margin-bottom: 0;
`

type PropTypes = {}

const DepartureBlocks: React.FC<PropTypes> = observer(() => {
  const inspection = useContext(PreInspectionContext)
  const inspectionId = inspection?.id || ''

  // Create day type groups with the special hook. Day type groups are departure blocks grouped by dayType.
  // The hook contains logic to select and deselect the dayTypes.
  let [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeToGroup, removeDayTypeFromGroup, addDayTypeGroup },
  ] = useDayTypeGroups()

  // The main query that fetches the departure blocks.
  let { data: availableDayTypesData, loading: departureBlocksLoading, refetch } = useQueryData(
    availableDayTypesQuery,
    {
      fetchPolicy: 'network-only', // I don't think the cache works well with a simple string array
      notifyOnNetworkStatusChange: true,
      skip: !inspectionId,
      variables: {
        inspectionId: inspectionId,
      },
    }
  )

  // Ensure the available dayTypes are in an array
  let dayTypesWithDepartures = useMemo(() => availableDayTypesData || [], [
    availableDayTypesData,
  ])

  // Figure out which day types are selectable. The day type is selectable (or unselectable)
  // when it doesn't have any blocks attached to it.
  let selectableDayTypes = useMemo(() => {
    return normalDayTypes.filter((dt) => !dayTypesWithDepartures.includes(dt))
  }, [dayTypesWithDepartures])

  // Callback for when the block configuration changes, which will update the blocks query.
  // Called from each day type group item.
  let onBlocksChange = useRefetch(refetch)

  // Add a new dayType group for each departure block group
  // if the dayYpe doesn't already exist in a group.
  useEffect(() => {
    for (let dayType of dayTypesWithDepartures) {
      if (!enabledDayTypes.includes(dayType)) {
        addDayTypeGroup(dayType as DayType)
      }
    }
  }, [dayTypesWithDepartures, enabledDayTypes])

  return (
    <DepartureBlocksView>
      <SectionTopBar>
        {dayTypesWithDepartures.length !== 0 && (
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
        let groupDayTypesDepartures = Object.entries(dayTypeGroup)
          .filter(([, enabled]) => enabled)
          .map(([dayType]) => dayType)
          .filter((dayType) => dayTypesWithDepartures.includes(dayType))

        return (
          <DepartureBlockGroupItem
            key={`dayTypeGroup-${groupIndex}`}
            loading={departureBlocksLoading}
            hasDepartures={groupDayTypesDepartures.length !== 0}
            selectableDayTypes={selectableDayTypes}
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
