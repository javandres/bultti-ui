import { TableRowWithDataAndFunctions } from '../common/table/tableUtils'
import { SanctionSummaryReportData } from '../schema-types'

export const reportCellHighlightMap = {
  sanctionSummary: shouldHighlightSanctionSummaryReportCell,
}

function shouldHighlightSanctionSummaryReportCell(
  rowItem: TableRowWithDataAndFunctions<SanctionSummaryReportData>,
  key: string
): boolean {
  return (
    key === 'averageAgeWeightedObserved' &&
    rowItem.item.averageAgeWeightedObserved > rowItem.item.unitEquipmentMaxAge
  )
}
