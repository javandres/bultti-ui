import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Table from '../common/components/Table'

const ListReportView = styled.div``

export type PropTypes<T = any> = {
  reportTitle: string
  reportDescription: string
  items: T[]
}

const ListReport = observer(<ItemType extends any>({ items }: PropTypes<ItemType>) => {
  return (
    <ListReportView>
      <Table<ItemType> items={items} />
    </ListReportView>
  )
})

export default ListReport
