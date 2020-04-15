import { DayType, DepartureBlock } from '../schema-types'
import { useCallback, useMemo, useState } from 'react'
import { flatten, orderBy } from 'lodash'
import { normalDayTypes } from '../constants'

export type DayTypeGroup = {
  [DayType.Ma]: boolean
  [DayType.Ti]: boolean
  [DayType.Ke]: boolean
  [DayType.To]: boolean
  [DayType.Pe]: boolean
  [DayType.La]: boolean
  [DayType.Su]: boolean
}

export type DayTypeState = Array<DayTypeGroup>

export const defaultDayTypeGroup: DayTypeGroup = {
  [DayType.Ma]: false,
  [DayType.Ti]: false,
  [DayType.Ke]: false,
  [DayType.To]: false,
  [DayType.Pe]: false,
  [DayType.La]: false,
  [DayType.Su]: false,
}

export const getEnabledDayTypes = (dayTypeGroup: DayTypeGroup): string[] =>
  Object.entries(dayTypeGroup)
    .filter(([, enabled]) => !!enabled)
    .map(([dt]) => dt)

export const isDayTypeEnabled = (dayType: DayType, dayTypeGroup: DayTypeGroup) =>
  getEnabledDayTypes(dayTypeGroup).includes(dayType)

export const createDepartureBlockKey = (item: DepartureBlock, dayType = item.dayType) =>
  `${item.id}/${dayType}`

type DayTypeGroupsReturn = [
  DayTypeState,
  string[],
  {
    addDayTypeGroup: (dayType?: DayType) => void
    setDayTypeInGroup: (dayType: DayType, groupIndex: number, setTo: boolean) => DayTypeState
    removeDayTypeFromGroup: (dayType: DayType, groupIndex: number) => DayTypeState
    addDayTypeToGroup: (dayType: DayType, groupIndex: number) => DayTypeState
  }
]

const orderDayTypeGroups = (dayTypeGroups) =>
  orderBy(dayTypeGroups, (group) => normalDayTypes.indexOf(getEnabledDayTypes(group)[0] || ''))

const spliceGroup = (groups, group, index) => {
  const nextDayTypeGroups = [...groups]

  if (group && Object.values(group).some((val) => val)) {
    nextDayTypeGroups.splice(index, 1, group)
  } else {
    nextDayTypeGroups.splice(index, 1)
  }

  return nextDayTypeGroups
}

export const useDayTypeGroups = (): DayTypeGroupsReturn => {
  const [dayTypeGroups, setDayTypeGroups] = useState<DayTypeState>([
    {
      ...defaultDayTypeGroup,
      [DayType.Ma]: true,
      [DayType.Ti]: true,
      [DayType.Ke]: true,
      [DayType.To]: true,
    },
  ])

  const enabledDayTypes: string[] = useMemo(
    () => flatten(dayTypeGroups.map((g) => getEnabledDayTypes(g))),
    [dayTypeGroups]
  )

  const createDayTypeGroup = useCallback((dayType: DayType) => {
    const dayTypeGroup: DayTypeGroup = { ...defaultDayTypeGroup, [dayType]: true }
    return dayTypeGroup
  }, [])

  // Add a day type group. Each day type (listed in availableDayTypes) should only be in a single group.
  // If passed a dayType, the function will only return the dayTypeGroup it is in without adding a
  // new one if it is found in a group already. If all dayTypes are used, nothing will happen.
  const addDayTypeGroup = useCallback(
    (addDayType?: DayType) => {
      // If no specific dayType was given, search for the next available and unused day type.
      let nextDayType =
        addDayType ??
        Object.keys(defaultDayTypeGroup).filter((dt) => !enabledDayTypes.includes(dt))[0]

      // No day type available to add, bail.
      if (!nextDayType || enabledDayTypes.includes(nextDayType)) {
        return
      }

      const addGroup: DayTypeGroup = createDayTypeGroup(nextDayType as DayType)
      const nextDayTypes: DayTypeGroup[] = orderDayTypeGroups([...dayTypeGroups, addGroup])
      setDayTypeGroups(nextDayTypes)
    },
    [dayTypeGroups]
  )

  const setDayTypeInGroup = useCallback(
    (dayType: DayType, groupIndex: number, setTo = true): DayTypeState => {
      let currentDayTypeGroups = [...dayTypeGroups]

      if (!currentDayTypeGroups[groupIndex]) {
        return currentDayTypeGroups
      }

      const group = currentDayTypeGroups[groupIndex]

      if (group) {
        group[dayType] = setTo
      }

      let nextDayTypeGroups = spliceGroup(currentDayTypeGroups, group, groupIndex)
      setDayTypeGroups(orderDayTypeGroups(nextDayTypeGroups))

      if (setTo && enabledDayTypes.includes(dayType)) {
        const existingIndex = nextDayTypeGroups.findIndex((dtg) => isDayTypeEnabled(dayType, dtg))

        nextDayTypeGroups = setDayTypeInGroup(dayType, existingIndex, false)
      }

      return nextDayTypeGroups
    },
    [dayTypeGroups]
  )

  const removeDayTypeFromGroup = useCallback(
    (dayType: DayType, groupIndex: number) => setDayTypeInGroup(dayType, groupIndex, false),
    [dayTypeGroups, setDayTypeInGroup]
  )

  const addDayTypeToGroup = useCallback(
    (dayType: DayType, groupIndex: number) => setDayTypeInGroup(dayType, groupIndex, true),
    [dayTypeGroups, setDayTypeInGroup]
  )

  return [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeGroup, setDayTypeInGroup, removeDayTypeFromGroup, addDayTypeToGroup },
  ]
}
