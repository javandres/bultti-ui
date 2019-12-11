import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { format, getISOWeek, parseISO } from 'date-fns'
import { OperatingArea } from '../schema-types'
import { groupBy, orderBy, uniqBy } from 'lodash'
import { Button } from '../components/Button'
import { orderByNumber } from '../utils/orderByNumber'
import { ExecutionRequirement } from '../types/inspection'

const WeeklyExecutionRequirementsView = styled.div``

const RequirementArea = styled.div`
  margin-bottom: 1rem;
  border: 1px solid var(--light-grey);
  border-radius: 5px;
`

const AreaHeading = styled.h4`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

const YearHeading = styled.h5`
  margin-top: 2rem;
  margin-bottom: 1rem;
`

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--lighter-grey);

  &:last-child {
    border-bottom: 0;
  }
`

const TableHeader = styled(TableRow)``

const TableCell = styled.div`
  flex: 1 1 calc(100% / 11);
  min-width: 45px;
  text-align: center;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
  justify-content: center;

  &:last-child {
    border-right: 0;
  }

  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }
`

const TableInput = styled.input`
  font-family: var(--font-family);
  padding: 0.5rem 0 0.5rem 0.15rem;
  text-align: right;
  border: 0;
  background: transparent;
  display: block;
  flex: 3 1 70%;
  width: 70%;
  font-size: 0.75rem;
`

const InputWrapper = styled.span`
  display: flex;
  align-items: center;
`

const SignWrapper = styled.span`
  flex: 1 1 auto;
  font-size: 0.75rem;
  padding: 0 0.2rem 0 0;
`

const ColumnHeaderCell = styled(TableCell)`
  padding: 0.5rem 0.5rem 0.25rem;
  font-weight: bold;
`

const RowHeaderCell = styled(TableCell)`
  padding: 0.5rem 0.5rem 0.4rem 0.5rem;
  font-weight: bold;
`

export type PropTypes = {
  requirements: ExecutionRequirement[]
  onChange: (requirement: ExecutionRequirement, nextValue: string) => void
  onReplace: (requirements: ExecutionRequirement[]) => void
  startDate: string
  endDate: string
}

const generateWeekRequirements = (
  year: number,
  week = 1,
  forArea?: OperatingArea
): ExecutionRequirement[] => {
  const requirements: ExecutionRequirement[] = []

  const generateForArea = (area) => {
    let equipmentClass = 1

    for (equipmentClass; equipmentClass < 10; equipmentClass++) {
      requirements.push({ area, equipmentClass, week, year, requirement: '0' })
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
type ListWithHeading = [string, ExecutionRequirement[]]

const WeeklyExecutionRequirements: React.FC<PropTypes> = observer(
  ({ requirements = [], onChange, onReplace, startDate, endDate }) => {
    const [week, year] = useMemo(() => {
      const startDateObj = parseISO(startDate)
      const week: number = getISOWeek(startDateObj)
      const year: number = parseInt(format(startDateObj, 'yyyy'), 10)

      return [week, year]
    }, [startDate])

    const currentRequirements: ExecutionRequirement[] = useMemo(() => {
      if (!year || !week) {
        return requirements
      }

      // If we have no requirements yet, create some to start us off.
      if (requirements.length === 0) {
        return generateWeekRequirements(year, week)
      }

      if (!requirements.some((req) => req.week === week && req.year === year)) {
        return [...requirements, ...generateWeekRequirements(year, week)]
      }

      return requirements
    }, [requirements, year, week])

    const onAddWeek = useCallback(() => {
      const prevReq = currentRequirements[currentRequirements.length - 1] || {}
      const currentWeek = prevReq?.week || 0

      if (currentWeek) {
        const currentYear = prevReq?.year || 0

        let nextWeek = currentWeek >= 52 ? 1 : currentWeek + 1
        let nextYear = nextWeek > currentWeek ? currentYear : currentYear + 1

        onReplace(
          uniqBy(
            [...currentRequirements, ...generateWeekRequirements(nextYear, nextWeek)],
            (req) => req.week + req.area + req.equipmentClass + '' + req.year
          )
        )
      }
    }, [onReplace, currentRequirements, week, year])

    const onChangeRequirement = useCallback(
      (req) => (e) => {
        const value = e.target.value || ''
        onChange(req, value)
      },
      [onChange]
    )

    // Apply the initial requirements if empty ones were generated.
    // Changes to the requirements go through the onChange handler so these
    // are never different except when currentRequirements are initialized.
    useEffect(() => {
      if (currentRequirements !== requirements) {
        onReplace(currentRequirements)
      }
    }, [onReplace, requirements, currentRequirements])

    const yearGroups = Object.entries(groupBy(currentRequirements, 'year'))

    return (
      <WeeklyExecutionRequirementsView>
        <Button onClick={onAddWeek}>+ 1 viikko</Button>
        {yearGroups.map(([year, yearReqs]) => {
          const areaRows = Object.entries(groupBy(yearReqs, 'area'))

          return (
            <React.Fragment key={year}>
              <YearHeading>{year}</YearHeading>
              {orderBy(areaRows, orderByNumber).map(([areaHeading, areaReqs]) => {
                const vehicleClasses = areaReqs.reduce((classes: number[], req) => {
                  if (!classes.includes(req.equipmentClass)) {
                    classes.push(req.equipmentClass)
                  }

                  return classes
                }, [])

                const weekRows: Array<ListWithHeading> = Object.entries(
                  groupBy(areaReqs, 'week')
                )

                return (
                  <React.Fragment key={areaHeading}>
                    <AreaHeading>{areaHeading}</AreaHeading>
                    <RequirementArea>
                      <TableHeader>
                        <ColumnHeaderCell style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
                          Class
                          <br />
                          Week
                        </ColumnHeaderCell>
                        {orderBy(vehicleClasses).map((vehicleClass) => (
                          <ColumnHeaderCell key={vehicleClass}>
                            {vehicleClass}
                          </ColumnHeaderCell>
                        ))}
                      </TableHeader>
                      {orderBy(weekRows, orderByNumber).map(([weekNumber, reqs]) => (
                        <TableRow key={weekNumber}>
                          <RowHeaderCell>{weekNumber}</RowHeaderCell>
                          {orderBy(
                            reqs,
                            [(req) => req.week, (req) => req.year],
                            ['asc', 'desc']
                          ).map((req, index) => (
                            <TableCell key={req.week + req.area + req.year + '' + index}>
                              <InputWrapper>
                                <TableInput
                                  maxLength={7}
                                  value={req.requirement}
                                  onChange={onChangeRequirement(req)}
                                />
                                <SignWrapper>%</SignWrapper>
                              </InputWrapper>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </RequirementArea>
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </WeeklyExecutionRequirementsView>
    )
  }
)

export default WeeklyExecutionRequirements
