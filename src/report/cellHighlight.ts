export const cellHighlight = {
  sanctionSummary: shouldHighlightCell,
}

function shouldHighlightCell(rowItem, key: string): boolean {
  return (
    key === 'averageAgeWeightedObserved' &&
    rowItem.item.averageAgeWeightedObserved > rowItem.item.unitEquipmentMaxAge
  )
}
