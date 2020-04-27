import React, { useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'
import { ReportComponentProps } from './reportUtil'
import ReportTableFilters from './ReportTableFilters'
import { mapValues } from 'lodash'

const ListReportView = styled.div``

export type PropTypes<T> = ReportComponentProps<T>

const ListReport = observer(
  <ItemType extends {}>({ items, columnLabels }: PropTypes<ItemType>) => {
    let [filteredItems, setFilteredItems] = useState(items)
    let tableItems =
      filteredItems.length === 0 && items.length !== 0
        ? // Make an item with null values to give header labels but still an empty table.
          [(mapValues(items[0], () => '') as unknown) as ItemType]
        : filteredItems

    return (
      <ListReportView>
        <ReportTableFilters
          items={items}
          onFilterApplied={setFilteredItems}
          excludeFields={['id', '__typename']}
        />
        <Table<ItemType>
          virtualized={true}
          maxHeight={window.innerHeight * 0.6}
          items={tableItems}
          hideKeys={['id']}
          columnLabels={columnLabels}
        />
      </ListReportView>
    )
  }
)

export default ListReport
