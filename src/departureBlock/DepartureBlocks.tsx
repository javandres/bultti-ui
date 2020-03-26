import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, flatten, groupBy, pick } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { defaultDayTypeGroup, getEnabledDayTypes, useDayTypeGroups } from './departureBlocksCommon'
import DepartureBlockGroupItem from './DepartureBlockGroupItem'
import { useQueryData } from '../util/useQueryData'
import { departureBlocksQuery } from './departureBlocksQuery'
import { DayType, DepartureBlock } from '../schema-types'
import { normalDayTypes } from '../constants'
import { FlexRow } from '../common/components/common'
import { PreInspectionContext } from '../preInspection/PreInspectionForm'

const DepartureBlocksView = styled.div`
  margin-bottom: 0;
`

type PropTypes = {}

const DepartureBlocks: React.FC<PropTypes> = observer(() => {
  const preInspection = useContext(PreInspectionContext)
  const preInspectionId = preInspection?.id || ''

  let [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeToGroup, removeDayTypeFromGroup, addDayTypeGroup },
  ] = useDayTypeGroups()

  let { data: departureBlocksData, loading: departureBlocksLoading, refetch } = useQueryData(
    departureBlocksQuery,
    {
      notifyOnNetworkStatusChange: true,
      skip: !preInspectionId,
      variables: {
        preInspectionId: preInspectionId,
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
      <FlexRow
        style={{
          margin: '0 -1rem',
          padding: '0 1rem 0.5rem',
          borderBottom: '1px solid var(--lighter-grey)',
        }}>
        <Button
          style={{ marginTop: '-1rem', marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => refetch()}>
          Päivitä
        </Button>
      </FlexRow>
      {dayTypeGroups.map((dayTypeGroup, groupIndex) => {
        let dayTypeBlocks = pick(departureBlockGroups, getEnabledDayTypes(dayTypeGroup))
        let departureBlocksForDayTypes: DepartureBlock[] = flatten(Object.values(dayTypeBlocks))

        return (
          <DepartureBlockGroupItem
            key={`dayTypeGroup-${groupIndex}`}
            loading={departureBlocksLoading}
            selectableDayTypes={selectableDayTypes}
            departureBlocks={departureBlocksForDayTypes}
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
