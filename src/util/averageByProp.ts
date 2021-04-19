import { round } from './round'
import { getTotalBig } from './getTotal'
import { DEFAULT_DECIMALS } from '../constants'

export function averageByProp<ItemType>(collection: ItemType[], prop: keyof ItemType) {
  return round(getTotalBig(collection, prop).div(collection.length || 1), DEFAULT_DECIMALS)
}
