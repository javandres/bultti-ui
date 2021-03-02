import { SanctionSummaryReportData } from '../schema-types'
import { text } from '../util/translate'

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

function getSanctionCols(
  sanctionAmount,
  sanctionReason,
  values: { sanctionAmountRatio: number; sanctionedKilometers: number } = {
    sanctionedKilometers: 0,
    sanctionAmountRatio: 0,
  }
) {
  let cols = {}
  let reasonText = text('postInspection_sanctionReason_' + sanctionReason)
  let sanctionAmountCol = `${reasonText} ${sanctionAmount}%`
  let sanctionAmountKmCol = `${reasonText} ${sanctionAmount}% = KM`

  cols[sanctionAmountCol] = values.sanctionAmountRatio
  cols[sanctionAmountKmCol] = values.sanctionedKilometers

  return cols
}

function sanctionSummaryTransform(
  rows: SanctionSummaryReportData[]
): SanctionSummaryReportItem[] {
  let resultRows = new Map<string, SanctionSummaryReportItem>()

  // Template for dynamic keyed sanction summary items
  let sanctionAmountColumnsTemplate = rows.reduce(
    (cols: Record<string, number>, { sanctionAmount, sanctionReason }) => {
      let sanctionCols = getSanctionCols(sanctionAmount, sanctionReason)
      return { ...cols, ...sanctionCols }
    },
    {}
  )

  for (let row of rows) {
    let {
      sanctionAmount,
      sanctionReason,
      sanctionAmountRatio,
      sanctionedKilometers,
      procurementUnitId,
    } = row

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

    let sanctionCols = getSanctionCols(sanctionAmount, sanctionReason, {
      sanctionedKilometers,
      sanctionAmountRatio,
    })

    let fullResultRow = {
      ...resultRow,
      ...sanctionCols,
    } as SanctionSummaryReportItem

    resultRows.set(procurementUnitId, fullResultRow)
  }

  return Array.from(resultRows.values())
}
