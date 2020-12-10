import { useCallback, useMemo, useState } from 'react'
import { flatten, orderBy } from 'lodash'
import { normalDayTypes } from '../constants'

export type DayTypeGroup = {
  Ma: boolean
  Ti: boolean
  Ke: boolean
  To: boolean
  Pe: boolean
  La: boolean
  Su: boolean
}

export type DayTypeState = Array<DayTypeGroup>

export const defaultDayTypeGroup: DayTypeGroup = {
  Ma: false,
  Ti: false,
  Ke: false,
  To: false,
  Pe: false,
  La: false,
  Su: false,
}

export const getEnabledDayTypes = (dayTypeGroup: DayTypeGroup): string[] =>
  Object.entries(dayTypeGroup)
    .filter(([, enabled]) => !!enabled)
    .map(([dt]) => dt)

export const isDayTypeEnabled = (dayType: string, dayTypeGroup: DayTypeGroup) =>
  getEnabledDayTypes(dayTypeGroup).includes(dayType)

type DayTypeGroupsReturn = [
  DayTypeState,
  string[],
  {
    addDayTypeGroup: (dayType?: string) => void
    setDayTypeInGroup: (dayType: string, groupIndex: number, setTo: boolean) => DayTypeState
    removeDayTypeFromGroup: (dayType: string, groupIndex: number) => DayTypeState
    addDayTypeToGroup: (dayType: string, groupIndex: number) => DayTypeState
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

export const useDayTypeGroups = (isEditable = true): DayTypeGroupsReturn => {
  const [dayTypeGroups, setDayTypeGroups] = useState<DayTypeState>([
    {
      ...defaultDayTypeGroup,
      Ma: true,
      Ti: true,
      Ke: true,
      To: true,
    },
  ])

  const enabledDayTypes: string[] = useMemo(
    () => flatten(dayTypeGroups.map((g) => getEnabledDayTypes(g))),
    [dayTypeGroups]
  )

  const createDayTypeGroup = useCallback((dayType: string) => {
    const dayTypeGroup: DayTypeGroup = { ...defaultDayTypeGroup, [dayType]: true }
    return dayTypeGroup
  }, [])

  // Add a day type group. Each day type (listed in availableDayTypes) should only be in a single group.
  // If passed a dayType, the function will only return the dayTypeGroup it is in without adding a
  // new one if it is found in a group already. If all dayTypes are used, nothing will happen.
  const addDayTypeGroup = useCallback(
    (addDayType?: string) => {
      // If no specific dayType was given, search for the next available and unused day type.
      let nextDayType =
        addDayType ??
        Object.keys(defaultDayTypeGroup).filter((dt) => !enabledDayTypes.includes(dt))[0]

      // No day type available to add, bail.
      if (!nextDayType || enabledDayTypes.includes(nextDayType)) {
        return
      }

      const addGroup: DayTypeGroup = createDayTypeGroup(nextDayType)
      const nextDayTypes: DayTypeGroup[] = orderDayTypeGroups([...dayTypeGroups, addGroup])
      setDayTypeGroups(nextDayTypes)
    },
    [dayTypeGroups]
  )

  const setDayTypeInGroup = useCallback(
    (dayType: string, groupIndex: number, setTo = true): DayTypeState => {
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
        const existingIndex = nextDayTypeGroups.findIndex((dtg) =>
          isDayTypeEnabled(dayType, dtg)
        )

        nextDayTypeGroups = setDayTypeInGroup(dayType, existingIndex, false)
      }

      return nextDayTypeGroups
    },
    [dayTypeGroups, isEditable]
  )

  const removeDayTypeFromGroup = useCallback(
    (dayType: string, groupIndex: number) => {
      if (!isEditable) {
        return dayTypeGroups
      }

      return setDayTypeInGroup(dayType, groupIndex, false)
    },
    [dayTypeGroups, setDayTypeInGroup, isEditable]
  )

  const addDayTypeToGroup = useCallback(
    (dayType: string, groupIndex: number) => {
      if (!isEditable) {
        return dayTypeGroups
      }

      return setDayTypeInGroup(dayType, groupIndex, true)
    },
    [dayTypeGroups, setDayTypeInGroup, isEditable]
  )

  return [
    dayTypeGroups,
    enabledDayTypes,
    { addDayTypeGroup, setDayTypeInGroup, removeDayTypeFromGroup, addDayTypeToGroup },
  ]
}
