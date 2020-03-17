import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import { TextInput } from './Input'
import { Button } from '../components/Button'
import { CellContent } from '../components/Table'
import { useOrderedValues } from '../../utils/useOrderedValues'

const ControlledFormView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 1px solid var(--lighter-grey);
  border-radius: 0.5rem;

  > *:nth-child(even) {
    background-color: #fafafa;
  }

  > *:nth-child(2) {
    border-top-right-radius: 0.5rem;
  }
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);

  &:nth-child(2n),
  &:last-child {
    border-right: 0;
  }

  &:nth-child(3):last-child {
    border-top: 1px solid var(--lighter-grey);
  }
`

const FieldLabel = styled.label`
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
`

export type PropTypes<ItemType = any> = {
  item: ItemType
  onChange: (key: string, value: string) => void
  onDone?: () => void
  readOnly?: boolean
  doneLabel?: string
  doneDisabled?: boolean
  labels?: { [key in keyof ItemType]: string }
  order?: string[]
  hideKeys?: string[]
  keyFromItem?: (item: ItemType) => string
  renderInput?: (val: any, key: string, onChange: (val: any) => void) => React.ReactChild
}

const renderReadOnlyField = (val) => <CellContent>{val}</CellContent>

const defaultRenderInput = (val, key, onChange) => (
  <TextInput theme="light" value={val} onChange={(e) => onChange(e.target.value)} name={key} />
)

const ItemForm: React.FC<PropTypes> = observer(
  ({
    item,
    labels = {},
    order,
    hideKeys,
    onChange,
    readOnly = false,
    onDone,
    doneDisabled = false,
    doneLabel = 'Valmis',
    renderInput = defaultRenderInput,
  }) => {
    const itemEntries = useOrderedValues(item, labels, order, hideKeys)

    const onValueChange = useCallback(
      (key) => (nextValue) => {
        onChange(key, nextValue)
      },
      [onChange]
    )

    return (
      <ControlledFormView>
        {itemEntries.map(([key, val], index) => (
          <FieldWrapper key={key}>
            <FieldLabel>{get(labels, key, key)}</FieldLabel>
            {readOnly ? renderReadOnlyField(val) : renderInput(val, key, onValueChange(key))}
          </FieldWrapper>
        ))}
        {onDone && (
          <FieldWrapper
            style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginLeft: 'auto' }}>
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
