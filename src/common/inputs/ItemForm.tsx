import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { difference, get, omitBy, orderBy } from 'lodash'
import { TextInput } from './Input'
import { Button } from '../components/Button'

const ControlledFormView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: -1rem;
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 calc(33% - 1rem);
  margin: 1rem 1rem 1rem 0;
`

const FieldLabel = styled.label`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
`

export type PropTypes<ItemType = any> = {
  item: ItemType
  onChange: (key: string, value: string) => void
  onDone?: () => void
  doneLabel?: string
  doneDisabled?: boolean
  labels?: { [key in keyof ItemType]: string }
  order?: string[]
  hideKeys?: string[]
  keyFromItem?: (item: ItemType) => string
  renderInput?: (val: any, key: string, onChange: (val: any) => void) => React.ReactChild
}

const defaultKeyFromItem = (item) => item.id

const defaultRenderInput = (key, val, onChange) => (
  <TextInput theme="light" value={val} onChange={onChange} name={key} />
)

const ItemForm: React.FC<PropTypes> = observer(
  ({
    item,
    labels = {},
    order,
    hideKeys,
    keyFromItem = defaultKeyFromItem,
    onChange,
    onDone,
    doneDisabled = false,
    doneLabel = 'Valmis',
    renderInput = defaultRenderInput,
  }) => {
    let itemEntries = Object.entries(omitBy(item, (val, key) => key.startsWith('_')))

    const labelKeys = Object.keys(labels)
    const inputOrdering = order && order.length !== 0 ? order : labelKeys

    let keysToHide: string[] = []

    // Hide keys listed in hideKeys if hideKeys is a non-zero array.
    // Hide keys NOT listed in columnLabels if hideKeys is undefined.
    // If hideKeys is a zero-length array no keys will be hidden.

    if (hideKeys && hideKeys.length !== 0) {
      keysToHide = hideKeys
    } else if (!hideKeys && labelKeys.length !== 0) {
      keysToHide = difference(
        itemEntries.map(([key]) => key),
        labelKeys
      )
    }

    if (inputOrdering.length !== 0) {
      itemEntries = orderBy(itemEntries, ([key]) => {
        const labelIndex = inputOrdering.indexOf(key)
        return labelIndex === -1 ? 999 : labelIndex
      }).filter(([key]) => !keysToHide.includes(key))
    }

    const inputKey = keyFromItem(item)

    const onValueChange = useCallback(
      (key) => (nextValue) => {
        onChange(key, nextValue)
      },
      [onChange]
    )

    return (
      <ControlledFormView>
        {itemEntries.map(([key, val], index) => (
          <FieldWrapper key={`${inputKey}_${key}`}>
            <FieldLabel>{get(labels, key, key)}</FieldLabel>
            {renderInput(val, key, onValueChange(key))}
          </FieldWrapper>
        ))}
        {onDone && (
          <FieldWrapper style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginLeft: 'auto' }}>
            <Button disabled={doneDisabled} onClick={onDone}>
              {doneLabel}
            </Button>
          </FieldWrapper>
        )}
      </ControlledFormView>
    )
  }
)

export default ItemForm
