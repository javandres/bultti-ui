import { useQuery } from 'urql'
import { get } from 'lodash'

export const useQueryData = (queryConfig, pickData = '') => {
  const [res, executeQuery] = useQuery(queryConfig)

  const dataKey =
    pickData || Object.keys(res?.data || {}).filter((key) => !key.startsWith('_'))[0]

  const data = get(res, `data.${dataKey}`, null)

  return { data, fetching: res.fetching, error: res.error, executeQuery }
}
