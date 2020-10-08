import { get } from 'lodash'

export const findDataKey = (data) =>
  Object.keys(data || {}).filter((key) => !key.startsWith('_'))[0]

export const pickGraphqlData = (data: any, pickKey = '') => {
  const dataKey = pickKey || findDataKey(data)
  return get(data, dataKey, undefined)
}
