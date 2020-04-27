import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Input from '../common/input/Input'
import Fuse from 'fuse.js'
import { omit } from 'lodash'

const ReportTableFiltersView = styled.div`
  margin-bottom: 1.5rem;
`

export type PropTypes<ItemType = any> = {
  items: ItemType[]
  onFilterApplied: (items: ItemType[]) => unknown
}

const ReportTableFilters = observer(({ items, onFilterApplied }: PropTypes) => {
  let [filterValue, setFilterValue] = useState('')

  let fuse = useMemo(
    () =>
      new Fuse(items, {
        includeScore: false,
        shouldSort: true,
        keys: Object.keys(omit(items[0], 'id')),
        useExtendedSearch: true,
      }),
    [items]
  )

  useEffect(() => {
    if (!filterValue || !items || items.length === 0) {
      onFilterApplied(items)
      return
    }

    let filteredItems = fuse.search(filterValue).map(({ item }) => item)
    onFilterApplied(filteredItems)
  }, [items, fuse, filterValue])

  return (
    <ReportTableFiltersView>
      <Input
        value={filterValue}
        onChange={setFilterValue}
        name="filter"
        type="text"
        theme="light"
        label="Search filter"
      />
    </ReportTableFiltersView>
  )
})

export default ReportTableFilters
