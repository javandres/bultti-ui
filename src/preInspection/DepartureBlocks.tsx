import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference } from 'lodash'
import { Button } from '../common/components/Button'
import { defaultDayTypeGroup, useDayTypeGroups } from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'

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

  return (
    <DepartureBlocksView>
      {dayTypeGroups.map((dayTypeGroup, groupIndex) => (
        <DepartureBlockGroupItem
          key={`dayTypeGroup-${groupIndex}`}
          inspectionId={inspectionId}
          dayTypeGroup={dayTypeGroup}
          groupIndex={groupIndex}
          onAddDayType={addDayTypeToGroup}
          onRemoveDayType={removeDayTypeFromGroup}
        />
      ))}
      {difference(Object.keys(defaultDayTypeGroup), enabledDayTypes).length !== 0 && (
        <Button onClick={() => addDayTypeGroup()}>Lisää päiväryhmä</Button>
      )}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
