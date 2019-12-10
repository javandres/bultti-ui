import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { OperatingArea } from '../schema-types'
import { format, getISOWeek, parseISO } from 'date-fns'

const WeeklyExecutionRequirementsView = styled.div``

export interface ExecutionRequirement {
  week: number
  year: number
  equipmentClass: number
  requirement: number
  area: OperatingArea
}

export type PropTypes = {
  requirements: ExecutionRequirement[]
  onChange: (requirements: ExecutionRequirement[]) => void
  startDate: string
}

const currentYear = parseInt(format(new Date(), 'yyyy'), 10)
const defaultStartDate = `${currentYear}-01-01`

const generateWeekRequirements = (
  year: number,
  area: OperatingArea,
  startingWeek = 1,
  weekAmount = 1
): ExecutionRequirement[] => {
  const requirements: ExecutionRequirement[] = []
  let weekNumber = startingWeek

  for (weekNumber; weekNumber < weekAmount + startingWeek; weekNumber++) {
    let equipmentClass = 1

    for (equipmentClass; equipmentClass < 10; equipmentClass++) {
      requirements.push({ year, area, equipmentClass, week: weekNumber, requirement: 0 })
    }
  }

  return requirements
}

const WeeklyExecutionRequirements: React.FC<PropTypes> = observer(
  ({ requirements = [], onChange, startDate }) => {
    const startWeek: number = !startDate ? 1 : getISOWeek(parseISO(startDate))

    const defaultYear: number = !startDate
      ? currentYear
      : parseInt(format(parseISO(startDate), 'yyyy'), 10)

    const currentRequirements: ExecutionRequirement[] = useMemo(() => {
      if (currentRequirements.length === 0) {
        return generateWeekRequirements(defaultYear, OperatingArea.Center, startWeek, 1)
      }

      return requirements
    }, [requirements, defaultYear, startWeek])

    // Apply the initial requirements if empty ones were generated.
    useEffect(() => {
      if (currentRequirements !== requirements) {
        onChange(currentRequirements)
      }
    }, [requirements, currentRequirements])

    const onAddWeek = useCallback(() => {}, [requirements])

    const onChangeYear = useCallback(() => {}, [requirements])

    const onChangeArea = useCallback(() => {}, [requirements])

    return (
      <WeeklyExecutionRequirementsView>
        <></>
      </WeeklyExecutionRequirementsView>
    )
  }
)

export default WeeklyExecutionRequirements
