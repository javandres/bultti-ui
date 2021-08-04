import { OptionMaxAgeIncreaseMethod, ProcurementUnit } from '../schema-types'
import { getDateObject } from '../util/formatDate'
import { differenceInMonths, differenceInYears, isBefore } from 'date-fns'
import { round } from '../util/round'

// Calculate the maximum age value of the unit. It starts with the base "maximumAverageAge" value, and
// if the unit uses option time, the maximum age is increased. There are tqo methods for increasing
// the maximum age value, by 0.5 years per option year or monthly. This function calculates
// the increase based on when the option period started and the reference date provided.
// This same function also exists on the server, so if you touch this, also make the
// changes in the server function of the same name.
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
      let optionYears = differenceInYears(dateObj, optionDateObj) + 1
      return 0.5 * optionYears + maximumAverageAge
    }

    if (optionMaxAgeIncreaseMethod === OptionMaxAgeIncreaseMethod.MonthlyIncrease) {
      // Option increases start immediately when the option period starts, so add 1 to
      // the month diff to express this.
      let optionMonths = differenceInMonths(dateObj, optionDateObj) + 1
      let optionMonthIncrease = optionMonths / 12
      return round(maximumAverageAge + optionMonthIncrease, 4)
    }
  }

  return maximumAverageAge
}
