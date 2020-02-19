import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { get, orderBy } from 'lodash'

const TableView = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid var(--light-grey);
  border-radius: 5px;
`

const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;

  &:last-child {
    border-bottom: 0;
  }
`

const TableHeader = styled(TableRow)``

const TableCell = styled.div`
  flex: 1 1 calc(100% / 11);
  min-width: 45px;
  text-align: center;
  border-right: 1px solid var(--lighter-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;

  &:last-child {
    border-right: 0;
  }

  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }
`

const ColumnHeaderCell = styled(TableCell)`
  padding: 0.5rem 0.5rem 0.4rem;
  font-weight: bold;
`

const CellContent = styled.div`
  padding: 0.5rem 0 0.5rem 0.15rem;
  text-align: center;
  border: 0;
  background: transparent;
  display: block;
`

export type PropTypes<ItemType = any> = {
  items: ItemType[]
  columnLabels: { [key in keyof ItemType]: string }
  indexCell?: React.ReactChild
  itemKeyProp: string
}

const Table: React.FC<PropTypes> = observer(
  ({ children, items, columnLabels = {}, indexCell = '', itemKeyProp = 'id' }) => {
    // For ordering keys of items
    const labelKeys = Object.keys(columnLabels)

    // Order the keys and get cleartext labels for the columns
    let columns = Object.keys(items[0])

    if (labelKeys.length !== 0) {
      columns = orderBy(columns, (key) => labelKeys.indexOf(key)).map((key) =>
        get(columnLabels, key, key)
      )
    }

    return (
      <TableView>
        <TableHeader>
          {indexCell && (
            <ColumnHeaderCell style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
              {indexCell}
            </ColumnHeaderCell>
          )}
          {columns.map((colName) => (
            <ColumnHeaderCell key={colName}>{colName}</ColumnHeaderCell>
          ))}
        </TableHeader>
        {items.map((item, rowIndex) => {
          let itemEntries = Object.entries(item)

          if (labelKeys.length !== 0) {
            itemEntries = orderBy(itemEntries, ([key]) => labelKeys.indexOf(key))
          }

          const itemValues = itemEntries.map(([, value]) => value)
          const rowKey = item[itemKeyProp]

          return (
            <TableRow key={rowKey ?? `row-${rowIndex}`}>
              {itemValues.map((val: any, index) => (
                <TableCell key={val ?? `empty-${index}`}>
                  {val && <CellContent>{val}</CellContent>}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableView>
    )
  }
)

export default Table
