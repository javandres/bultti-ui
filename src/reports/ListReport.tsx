import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'
import { ReportComponentProps } from './reportUtil'
import ReportTableFilters from './ReportTableFilters'
import { EmptyView } from '../common/components/Messages'
import { toString } from 'lodash'

const ListReportView = styled.div``

const TableEmptyView = styled(EmptyView)`
  margin: 1rem !important;
`

export type PropTypes<T> = ReportComponentProps<T>

const ListReport = observer(
  <ItemType extends {}>({ items, columnLabels }: PropTypes<ItemType>) => {
    const renderCellValue = useCallback((key, val) => {
      if (typeof val === 'boolean' || typeof val === 'undefined' || val === null) {
        return (
          <span style={{ fontSize: '1.2rem', marginTop: '-3px', display: 'block' }}>
            {val ? '✓' : '⨯'}
          </span>
        )
      }

      return toString(val)
    }, [])

    return (
      <ListReportView>
        <ReportTableFilters<ItemType> items={items} excludeFields={['id', '__typename']}>
          {(filteredItems) => (
            <Table<ItemType>
              virtualized={true}
              maxHeight={window.innerHeight * 0.6}
              items={filteredItems}
              hideKeys={['id']}
              renderValue={renderCellValue}
              columnLabels={columnLabels}>
              <TableEmptyView>Taulukko on tyhjä.</TableEmptyView>
            </Table>
          )}
        </ReportTableFilters>
      </ListReportView>
    )
  }
)

export default ListReport
