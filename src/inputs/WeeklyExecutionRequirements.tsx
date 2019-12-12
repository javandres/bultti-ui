import React, { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { format, getISOWeek, parseISO, endOfWeek, addWeeks } from 'date-fns'
import { OperatingArea } from '../schema-types'
import { groupBy, orderBy, uniqBy } from 'lodash'
import { Button, ButtonSize } from '../components/Button'
import { orderByNumber } from '../utils/orderByNumber'
import { ExecutionRequirement } from '../types/inspection'
import { toJS } from 'mobx'

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

const RemoveButton = styled(Button).attrs({ size: ButtonSize.SMALL })`
  background: var(--red);
  position: absolute;
  border: 0;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  padding: 0;
  line-height: 1;
  align-items: baseline;
  justify-content: center;
  font-size: 0.75rem;
  left: -0.75rem;
  top: 0.4rem;
  display: none;
`

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;

  &:last-child {
    border-bottom: 0;
  }

  &:hover ${RemoveButton} {
    display: flex;
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
  padding: 0.5rem 0.5rem 0.4rem;
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
  onRemove: (requirement: ExecutionRequirement) => void
  date: string
  maxDate: string
}

const generateWeekRequirements = (
  year: number,
  week = 1,
  copyFrom: ExecutionRequirement[] = []
): ExecutionRequirement[] => {
  const requirements: ExecutionRequirement[] = []

  const generateForArea = (area) => {
    let equipmentClass = 1

    for (equipmentClass; equipmentClass < 10; equipmentClass++) {
      const copyFromReq = copyFrom.find(
        (req) => req.equipmentClass === equipmentClass && req.area === area
      )

      requirements.push({
        area,
        equipmentClass,
        week,
        year,
        requirement: copyFromReq?.requirement || '0',
      })
    }
  }

  generateForArea(OperatingArea.Center)
  generateForArea(OperatingArea.Other)

  return requirements
}

const orderRequirements = (requirements: ExecutionRequirement[]): ExecutionRequirement[] => {
  return orderBy(requirements, [(req) => req.year, (req) => req.week], ['asc', 'asc'])
}

const getReferenceWeek = (requirements, week, year) => {
  let referenceRows: ExecutionRequirement[] = []

  const nextWeekRows = requirements.filter(
    (req) => req.week === week + 1 && req.year === (week >= 52 ? year + 1 : year)
  )

  const prevWeekRows = requirements.filter(
    (req) =>
      req.week === (week > 1 ? week - 1 : 52) && req.year === (week > 1 ? year : year - 1)
  )

  if (nextWeekRows.length !== 0) {
    referenceRows = nextWeekRows
  } else if (prevWeekRows.length !== 0) {
    referenceRows = prevWeekRows
  }

  return referenceRows
}

const createWeekKey = (week, year) => parseInt(`${year}${week < 10 ? '0' : ''}${week}`, 10)

const getWeekAndYear = (date) => {
  if (!date) {
    return [0, 0]
  }

  const dateObj = date instanceof Date ? date : parseISO(date)
  const weekEnd = endOfWeek(dateObj)
  const week: number = getISOWeek(weekEnd)
  const year: number = parseInt(format(weekEnd, 'yyyy'), 10)

  return [week, year]
}

type ListWithHeading = [string, ExecutionRequirement[]]

const WeeklyExecutionRequirements: React.FC<PropTypes> = observer(
  ({ requirements = [], onChange, onReplace, onRemove, date, maxDate }) => {
    const [currentWeek, currentYear] = useMemo(() => getWeekAndYear(date), [date])
    const [endWeek, endYear] = useMemo(() => getWeekAndYear(maxDate), [maxDate])

    const currentWeekKey = useMemo(() => createWeekKey(currentWeek, currentYear), [
      currentWeek,
      currentYear,
    ])

    const maxWeekKey = useMemo(() => createWeekKey(endWeek, endYear), [endWeek, endYear])

    const currentRequirements: ExecutionRequirement[] = useMemo(() => {
      if (!currentYear || !currentWeek) {
        return requirements
      }

      // If we have no requirements yet, create some to start us off.
      if (requirements.length === 0) {
        return generateWeekRequirements(currentYear, currentWeek)
      }

      // If there are no rows for the currently selected week, create some. Copy requirements
      // from previous or next week if possible.
      if (
        !requirements.some((req) => req.week === currentWeek && req.year === currentYear) &&
        currentWeekKey <= maxWeekKey
      ) {
        const copyFrom = getReferenceWeek(requirements, currentWeek, currentYear)

        return orderRequirements([
          ...requirements,
          ...generateWeekRequirements(currentYear, currentWeek, copyFrom),
        ])
      }

      return requirements
    }, [requirements, currentYear, currentWeek, currentWeekKey, maxWeekKey])

    const [nextWeek, nextYear] = useMemo(() => {
      let prevReq = currentRequirements[currentRequirements.length - 1]

      const prevWeek = prevReq?.week || currentWeek
      const prevYear = prevReq?.year || currentYear

      let nextWeek = prevWeek >= 52 ? 1 : prevWeek + 1
      let nextYear = nextWeek < prevWeek ? prevYear + 1 : prevYear

      return [nextWeek, nextYear]
    }, [currentWeek, currentYear, currentRequirements])

    const nextWeekKey = useMemo(() => createWeekKey(nextWeek, nextYear), [nextWeek, nextYear])

    const onAddWeek = useCallback(() => {
      if (nextWeekKey > maxWeekKey) {
        return
      }

      const copyFrom = getReferenceWeek(currentRequirements, nextWeek, nextYear)

      onReplace(
        orderRequirements(
          uniqBy(
            [
              ...toJS(currentRequirements),
              ...generateWeekRequirements(nextYear, nextWeek, copyFrom),
            ],
            (req) => req.week + req.area + req.equipmentClass + '' + req.year
          )
        )
      )
    }, [onReplace, nextWeek, nextYear, nextWeekKey, maxWeekKey])

    const onRemoveWeek = useCallback(
      (modelReq: ExecutionRequirement) => () => {
        const removeReqs = currentRequirements.filter(
          (req) => req.year === modelReq.year && req.week === modelReq.week
        )

        if (removeReqs.length !== 0) {
          for (const rmReq of removeReqs) {
            onRemove(rmReq)
          }
        }
      },
      [currentRequirements]
    )

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
        {orderBy(yearGroups, ([year]) => parseInt(year, 10), ['desc']).map(
          ([year, yearReqs]) => {
            const areaRows = Object.entries(groupBy(yearReqs, 'area'))

            return (
              <React.Fragment key={year}>
                <YearHeading>{year}</YearHeading>
                {areaRows.map(([areaHeading, areaReqs]) => {
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
                          <ColumnHeaderCell
                            style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
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
                            {reqs.map((req, index) => (
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
                            <RemoveButton onClick={onRemoveWeek(reqs[0])}>X</RemoveButton>
                          </TableRow>
                        ))}
                      </RequirementArea>
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )
          }
        )}
        {nextWeekKey <= maxWeekKey && <Button onClick={onAddWeek}>+ 1 viikko</Button>}
      </WeeklyExecutionRequirementsView>
    )
  }
)

export default WeeklyExecutionRequirements
