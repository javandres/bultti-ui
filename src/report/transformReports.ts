import { SanctionSummaryReportData } from '../schema-types'
import { text } from '../util/translate'

const reportTransformsMap = {
  sanctionSummary: sanctionSummaryTransform,
}

export function transformReport(reportName: string, reportRows: unknown[]) {
  let transformFn = reportTransformsMap[reportName] || ((rows) => rows)
  return transformFn(reportRows)
}

export function hasReportTransform(reportName: string) {
  return !!reportTransformsMap[reportName]
}

type SanctionSummaryReportItemConstants = {
  procurementUnitId: string
  totalKilometers: number
  areaName: string
  averageAgeWeightedObserved: number
  unitEquipmentMaxAge: number
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
  let sanctionAmountKmCol = `${reasonText} KM`

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
        totalKilometers: row.totalKilometers,
        areaName: row.areaName,
        averageAgeWeightedObserved: row.averageAgeWeightedObserved,
        unitEquipmentMaxAge: row.unitEquipmentMaxAge,
        ...sanctionAmountColumnsTemplate,
      }
    } else {
      resultRow.totalKilometers = row.totalKilometers
      resultRow.unitEquipmentMaxAge = row.unitEquipmentMaxAge
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
