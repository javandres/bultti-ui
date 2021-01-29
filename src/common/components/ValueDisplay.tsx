import React from 'react'
import styled, { CSSProperties } from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import { useOrderedValues } from '../../util/useOrderedValues'

const ValueDisplayView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 1px solid var(--lighter-grey);
  border-bottom: 0;
  border-radius: 0.5rem;
  overflow: hidden;

  > *:nth-child(2n) {
    background-color: #fafafa;
  }
`

const ValueWrapper = styled.div<{ widthFraction?: number }>`
  display: flex;
  flex-direction: column;
  flex: 1 1 ${({ widthFraction = 2 }) => `${100 / Math.max(1, widthFraction)}%`};
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);
  border-bottom: 1px solid var(--lighter-grey);

  &:nth-child(${({ widthFraction = 2 }) => widthFraction}n),
  &:last-child {
    border-right: 0;
  }

  &:nth-child(${({ widthFraction = 2 }) => widthFraction}) {
    border-top-right-radius: 0.5rem;
  }
`

const ValueLabel = styled.label`
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
  user-select: none;
`

const ValueView = styled.div``

export type PropTypes<ItemType = any> = {
  item: ItemType
  labels?: { [key in keyof ItemType]: string }
  order?: string[]
  hideKeys?: string[]
  renderValue?: (key: string, val: any) => any
  objectPaths?: { [key in keyof ItemType]: string }
  className?: string
  children?: React.ReactChild | false
  style?: CSSProperties
  valuesPerRow?: number
}

const defaultRenderValue = (key, val) => {
  if (Array.isArray(val)) {
    return val.join(', ')
  }

  return val
}

const ValueDisplay: React.FC<PropTypes> = observer(
  ({
    className,
    item,
    labels = {},
    order,
    hideKeys,
    renderValue = defaultRenderValue,
    children,
    style,
    objectPaths,
    valuesPerRow = 2,
  }) => {
    let itemEntries = useOrderedValues(item, labels, order, hideKeys)

    return (
      <ValueDisplayView style={style} className={className}>
        {itemEntries.map(([key, val]) => {
          let displayValue = val

          if (typeof val === 'object' && !!objectPaths && objectPaths[key]) {
            let path = get(objectPaths, key)

            if (!path) {
              return null
            }

            displayValue = get(val, path)
          }

          if (
            displayValue === null ||
            typeof displayValue === 'undefined' ||
            typeof displayValue === 'object'
          ) {
            return null
          }

          return (
            <ValueWrapper widthFraction={valuesPerRow} key={key}>
              <ValueLabel>{get(labels, key, key)}</ValueLabel>
              <ValueView>{renderValue(key, displayValue)}</ValueView>
            </ValueWrapper>
          )
        })}
        {children && <ValueWrapper>{children}</ValueWrapper>}
      </ValueDisplayView>
    )
  }
)

export default ValueDisplay
