import { OptionMaxAgeIncreaseMethod, ProcurementUnit } from '../schema-types'
import { getDateObject } from '../util/formatDate'
import {
  differenceInCalendarISOWeekYears,
  differenceInCalendarMonths,
  isBefore,
} from 'date-fns'
import { round } from '../util/round'

export function calculateMaximumAverageAge(
  procurementUnit: ProcurementUnit,
  referenceDate: string | Date
) {
  let dateObj = getDateObject(referenceDate)

  let {
    maximumAverageAge,
    optionPeriodStart,
    optionMaxAgeIncreaseMethod = OptionMaxAgeIncreaseMethod.HalfYearIncrease,
  } = procurementUnit

  if (optionPeriodStart) {
    let optionDateObj = getDateObject(optionPeriodStart)

    if (isBefore(dateObj, optionDateObj)) {
      return maximumAverageAge
    }

    if (optionMaxAgeIncreaseMethod === OptionMaxAgeIncreaseMethod.HalfYearIncrease) {
      // Option increases start immediately when the option period starts, so add 1 to
      // the year diff to express this.
      let optionYears = differenceInCalendarISOWeekYears(dateObj, optionDateObj) + 1
      return maximumAverageAge + 0.5 * optionYears
    }

    if (optionMaxAgeIncreaseMethod === OptionMaxAgeIncreaseMethod.MonthlyIncrease) {
      // Option increases start immediately when the option period starts, so add 1 to
      // the month diff to express this.
      let optionMonths = differenceInCalendarMonths(dateObj, optionDateObj) + 1
      let optionMonthIncrease = optionMonths / 12
      return round(maximumAverageAge + optionMonthIncrease, 4)
    }
  }

  return maximumAverageAge
}
