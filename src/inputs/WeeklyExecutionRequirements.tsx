import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { format, getISOWeek, parseISO } from 'date-fns'
import { OperatingArea } from '../schema-types'
import { groupBy, orderBy, uniqBy } from 'lodash'
import { Button } from '../components/Button'

const WeeklyExecutionRequirementsView = styled.div``

const RequirementArea = styled.div`
  margin-bottom: 2rem;
  border: 1px solid var(--light-grey);
  background: rgba(0, 0, 0, 0.025);
  border-radius: 5px;
`

const RequirementRow = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 5px;

  &:nth-child(even) {
    background: rgba(255, 255, 255, 1);
  }
`

const AreaHeading = styled.h4`
  margin-bottom: 0.5rem;
`

export interface ExecutionRequirement {
  week: number
  equipmentClass: number
  requirement: number
  area: OperatingArea
}

export type PropTypes = {
  requirements: ExecutionRequirement[]
  onChange: (requirements: ExecutionRequirement[]) => void
  startDate: string
  endDate: string
}

const presentYear = parseInt(format(new Date(), 'yyyy'), 10)

const generateWeekRequirements = (
  startingWeek = 1,
  weekAmount = 1,
  forArea?: OperatingArea
): ExecutionRequirement[] => {
  const requirements: ExecutionRequirement[] = []

  const generateForArea = (area) => {
    let weekNumber = startingWeek

    for (weekNumber; weekNumber < weekAmount + startingWeek; weekNumber++) {
      let equipmentClass = 1

      for (equipmentClass; equipmentClass < 10; equipmentClass++) {
        requirements.push({ area, equipmentClass, week: weekNumber, requirement: 0 })
      }
    }
  }

  if (forArea) {
    generateForArea(forArea)
  } else {
    generateForArea(OperatingArea.Center)
    generateForArea(OperatingArea.Other)
  }

  return requirements
}

const WeeklyExecutionRequirements: React.FC<PropTypes> = observer(
  ({ requirements = [], onChange, startDate, endDate }) => {
    const startWeek: number = !startDate ? 1 : getISOWeek(parseISO(startDate))
    const maxWeek: number = !endDate ? 52 : getISOWeek(parseISO(endDate))

    const defaultYear: number = !startDate
      ? presentYear
      : parseInt(format(parseISO(startDate), 'yyyy'), 10)

    const currentRequirements: ExecutionRequirement[] = useMemo(() => {
      // If we have no requirements yet, create some to start us off.
      if (requirements.length === 0) {
        return generateWeekRequirements(startWeek, 1)
      }

      if (!requirements.some((req) => req.week === startWeek)) {
        return orderBy([...requirements, ...generateWeekRequirements(startWeek, 1)], 'week')
      }

      return requirements
    }, [requirements, defaultYear, startWeek])

    const onAddWeek = useCallback(() => {
      const nextWeek = (currentRequirements[currentRequirements.length - 1]?.week || 0) + 1

      if (nextWeek && nextWeek <= maxWeek) {
        onChange(
          uniqBy(
            [...currentRequirements, ...generateWeekRequirements(nextWeek, 1)],
            (req) => req.week + req.area + req.equipmentClass
          )
        )
      }
    }, [currentRequirements, maxWeek])

    const areaGroups = useMemo(() => Object.entries(groupBy(currentRequirements, 'area')), [
      currentRequirements,
    ])

    // Apply the initial requirements if empty ones were generated.
    // Changes to the requirements go through the onChange handler so these
    // are never different except when currentRequirements are initialized.
    useEffect(() => {
      if (currentRequirements !== requirements) {
        onChange(currentRequirements)
      }
    }, [requirements, currentRequirements])

    return (
      <WeeklyExecutionRequirementsView>
        <Button onClick={onAddWeek}>+1 viikko</Button>
        {areaGroups.map(([area, reqs]) => {
          const vehicleClasses = reqs.reduce((classes: number[], req) => {
            if (!classes.includes(req.equipmentClass)) {
              classes.push(req.equipmentClass)
            }

            return classes
          }, [])

          return (
            <React.Fragment key={area}>
              <AreaHeading>{area}</AreaHeading>
              <RequirementArea>
                {reqs.map((req) => (
                  <RequirementRow key={req.area + req.equipmentClass + '' + req.week}>
                    <pre>
                      <code>{JSON.stringify(req, null, 2)}</code>
                    </pre>
                  </RequirementRow>
                ))}
              </RequirementArea>
            </React.Fragment>
          )
        })}
      </WeeklyExecutionRequirementsView>
    )
  }
)

export default WeeklyExecutionRequirements
