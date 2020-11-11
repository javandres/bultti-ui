import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'
import { ReportComponentProps } from './reportUtil'
import { EmptyView } from '../common/components/Messages'
import { toString } from 'lodash'
import { round } from '../util/round'
import { SortConfig } from '../schema-types'

const ListReportView = styled.div``

const TableEmptyView = styled(EmptyView)`
  margin: 1rem !important;
`

export type PropTypes<T> = {
  sort?: SortConfig[]
  setSort?: (arg: ((sort: SortConfig[]) => SortConfig[]) | SortConfig[]) => unknown
} & ReportComponentProps<T>

const ListReport = observer(
  <ItemType extends {}>({ items, columnLabels, sort, setSort }: PropTypes<ItemType>) => {
    const renderCellValue = useCallback((key, val) => {
      if (typeof val === 'boolean' || typeof val === 'undefined' || val === null) {
        return (
          <span style={{ fontSize: '1.2rem', marginTop: '-3px', display: 'block' }}>
            {val ? '✓' : '⨯'}
          </span>
        )
      }

      if (typeof val === 'number') {
        return toString(round(val))
      }

      return toString(val)
    }, [])

    return (
      <ListReportView>
        <Table<ItemType>
          virtualized={true}
          keyFromItem={(item: any) =>
            item?.id || item?._id || item?.departureId || item?.registryNr || ''
          }
          maxHeight={window.innerHeight * 0.75}
          items={items}
          hideKeys={!columnLabels ? ['id'] : undefined}
          renderValue={renderCellValue}
          sort={sort}
          setSort={setSort}
          columnLabels={columnLabels}>
          <TableEmptyView>Taulukko on tyhjä.</TableEmptyView>
        </Table>
      </ListReportView>
    )
  }
)

export default ListReport
