import { SanctionSummaryReportData } from '../schema-types'

const reportTransforms = {
  sanctionSummary: sanctionSummaryTransform,
}

export function transformReport<RowType extends {}>(
  reportName: string,
  reportRows: RowType[]
) {
  let transformFn = reportTransforms[reportName] || ((rows) => rows)
  return transformFn(reportRows)
}

export function hasReportTransform(reportName: string) {
  return !!reportTransforms[reportName]
}

type SanctionSummaryReportItemConstants = {
  procurementUnitId: string
  areaName: string
  averageAgeWeightedObserved: number
}

type SanctionSummaryReportItem = SanctionSummaryReportItemConstants & Record<string, number>

function sanctionSummaryTransform(
  rows: SanctionSummaryReportData[]
): SanctionSummaryReportItem[] {
  let resultRows = new Map<string, SanctionSummaryReportItem>()

  // Template for dynamic keyed sanction summary items
  let sanctionAmountColumnsTemplate = rows.reduce(
    (cols: Record<string, number>, { sanctionAmount }) => {
      let sanctionAmountCol = `Sanktio ${sanctionAmount}%`
      let sanctionAmountKmCol = `Sanktio ${sanctionAmount}KM`

      cols[sanctionAmountCol] = 0
      cols[sanctionAmountKmCol] = 0

      return cols
    },
    {}
  )

  for (let row of rows) {
    let { sanctionAmount, sanctionAmountRatio, sanctionedKilometers, procurementUnitId } = row
    let resultRow: SanctionSummaryReportItemConstants | undefined = resultRows.get(
      procurementUnitId
    )

    if (!resultRow) {
      resultRow = {
        procurementUnitId: row.procurementUnitId,
        areaName: row.areaName,
        averageAgeWeightedObserved: row.averageAgeWeightedObserved,
        ...sanctionAmountColumnsTemplate,
      }
    }

    resultRow[`Sanktio ${sanctionAmount}%`] = sanctionAmountRatio
    resultRow[`Sanktio ${sanctionAmount}KM`] = sanctionedKilometers

    resultRows.set(procurementUnitId, resultRow as SanctionSummaryReportItem)
  }

  return Array.from(resultRows.values())
}
