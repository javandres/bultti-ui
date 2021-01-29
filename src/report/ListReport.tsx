import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'
import { ReportComponentProps } from './reportUtil'
import { EmptyView } from '../common/components/Messages'
import { pick, toString } from 'lodash'
import { round } from '../util/round'
import { SortConfig } from '../schema-types'
import { format, isValid, parseISO } from 'date-fns'
import { READABLE_TIME_FORMAT } from '../constants'

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
        return round(val)
      }

      if (val.length >= 20) {
        let date: Date | undefined

        try {
          let parsedDate = parseISO(val)

          if (isValid(parsedDate)) {
            date = parsedDate
          }
        } catch (err) {
          date = undefined
        }

        if (date) {
          return format(date, READABLE_TIME_FORMAT + ':ss')
        }
      }

      return toString(val)
    }, [])

    let existingPropLabels = useMemo(() => {
      let existingProps = Object.keys((items || [])[0] || {})

      if (existingProps.length !== 0) {
        return pick(columnLabels, existingProps)
      }

      return columnLabels
    }, [columnLabels, items])

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
          columnLabels={existingPropLabels}>
          <TableEmptyView>Taulukko on tyhjä.</TableEmptyView>
        </Table>
      </ListReportView>
    )
  }
)

export default ListReport
