import React, { useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'
import { ReportComponentProps } from './reportUtil'
import ReportTableFilters from './ReportTableFilters'

const ListReportView = styled.div``

export type PropTypes<T = any> = ReportComponentProps<T>

const ListReport = observer(
  <ItemType extends any>({ items, columnLabels }: PropTypes<ItemType>) => {
    let [filteredItems, setFilteredItems] = useState(items)

    return (
      <ListReportView>
        <ReportTableFilters items={items} onFilterApplied={setFilteredItems} />
        <Table<ItemType>
          virtualized={true}
          items={filteredItems}
          hideKeys={['id']}
          columnLabels={columnLabels}
        />
      </ListReportView>
    )
  }
)

export default ListReport
