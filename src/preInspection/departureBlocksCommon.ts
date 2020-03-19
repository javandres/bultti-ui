import { DayType, DepartureBlock } from '../type/inspection'

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

export type DepartureBlockGroup = {
  dayTypes: DayTypeGroup
  groupIndex: number
  blocks: DepartureBlock[]
}

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
