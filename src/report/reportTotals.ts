import React from 'react'
import { EmissionClassExecutionReportData } from '../schema-types'
import { getTotal } from '../util/getTotal'
import { round } from '../util/round'
import { text } from '../util/translate'
import { getThousandSeparatedNumber } from '../util/formatNumber'
import { DEFAULT_DECIMALS } from '../constants'

// Define column total functions here with the name of the report they apply to.
const reportTotalFns = {
  emissionClassExecution: createEmissionClassExecutionColumnTotals,
  observedEmissionClassExecution: createEmissionClassExecutionColumnTotals,
}

// Return the applicable total function or undefined to signal that no totals should be shown.
export function createColumnTotalCallback(
  reportName: string,
  rows: unknown[]
): ((key: string) => React.ReactChild) | undefined {
  let reportTotalFn = reportTotalFns[reportName]

  if (!reportTotalFn) {
    return undefined
  }

  return reportTotalFn(rows)
}

function createEmissionClassExecutionColumnTotals(rows: EmissionClassExecutionReportData[]) {
  return (key: keyof EmissionClassExecutionReportData) => {
    if (key === 'procurementUnitId') {
      return text('table_totalCount')
    }
    // Show the total kilometers of this emission class
    return getThousandSeparatedNumber(round(getTotal(rows, key), DEFAULT_DECIMALS)) + ' km'
  }
}
