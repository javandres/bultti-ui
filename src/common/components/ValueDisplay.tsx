import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import { useOrderedValues } from '../../utils/useOrderedValues'

const ValueDisplayView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 1px solid var(--lighter-grey);
  border-radius: 0.5rem;
  overflow: hidden;

  > *:nth-child(even) {
    background-color: #fafafa;
  }
`

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);

  &:last-child {
    border-right: 0;
  }
`

const ValueLabel = styled.label`
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
`

const ValueView = styled.div``

export type PropTypes<ItemType = any> = {
  item: ItemType
  labels?: { [key in keyof ItemType]: string }
  order?: string[]
  hideKeys?: string[]
  renderValue?: (val: any) => any
  className?: string
}

const defaultRenderValue = (val) => val

const ValueDisplay: React.FC<PropTypes> = observer(
  ({ className, item, labels = {}, order, hideKeys, renderValue = defaultRenderValue }) => {
    let itemEntries = useOrderedValues(item, labels, order, hideKeys)

    return (
      <ValueDisplayView className={className}>
        {itemEntries.map(([key, val], index) => {
          if (typeof val === 'object') {
            return null
          }

          return (
            <ValueWrapper key={key}>
              <ValueLabel>{get(labels, key, key)}</ValueLabel>
              <ValueView>{renderValue(val)}</ValueView>
            </ValueWrapper>
          )
        })}
      </ValueDisplayView>
    )
  }
)

export default ValueDisplay
