import React, { useCallback } from 'react'
import styled, { CSSProperties } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import { TextInput } from './Input'
import { Button, ButtonStyle } from '../components/Button'
import { useOrderedValues } from '../../util/useOrderedValues'

export const ControlledFormView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 1px solid var(--lighter-grey);
  border-bottom: 0;
  border-radius: 0.5rem;
  background: white;

  > *:nth-child(2n + 2n) {
    background-color: #fafafa;
  }

  > *:nth-child(2) {
    border-top-right-radius: 0.5rem;
  }
`

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--lighter-grey);
  border-bottom: 1px solid var(--lighter-grey);

  &:nth-child(2n),
  &:last-child {
    border-right: 0;
  }
`

export const FieldLabel = styled.label`
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
  user-select: none;
`

export const FieldValueDisplay = styled.div`
  padding: 0.5rem 0.15rem;
  border: 0;
  background: transparent;
  display: block;
  width: 100%;
`

export const ActionsWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
`

export type PropTypes<ItemType = any> = {
  item: ItemType
  children?: React.ReactChild
  onChange: (key: string, value: string) => void
  onDone: () => void
  onCancel: () => void
  readOnly?: boolean | string[]
  doneLabel?: string
  doneDisabled?: boolean
  labels?: { [key in keyof ItemType]: string }
  order?: string[]
  hideKeys?: string[]
  keyFromItem?: (item: ItemType) => string
  renderInput?: (key: string, val: any, onChange: (val: any) => void) => React.ReactChild
  style?: CSSProperties
}

const renderReadOnlyField = (val) => <FieldValueDisplay>{val}</FieldValueDisplay>

const defaultRenderInput = (key, val, onChange) => (
  <TextInput theme="light" value={val} onChange={(e) => onChange(e.target.value)} name={key} />
)

const ItemForm: React.FC<PropTypes> = observer(
  ({
    item,
    children,
    labels = {},
    order,
    hideKeys,
    onChange,
    readOnly = false,
    onDone,
    onCancel,
    doneDisabled = false,
    doneLabel = 'Valmis',
    renderInput = defaultRenderInput,
    style,
  }) => {
    const itemEntries = useOrderedValues(item, labels, order, hideKeys)

    const onValueChange = useCallback(
      (key) => (nextValue) => {
        onChange(key, nextValue)
      },
      [onChange]
    )

    let isReadOnly = useCallback(
      (key) =>
        readOnly === true ? true : Array.isArray(readOnly) ? readOnly.includes(key) : false,
      [readOnly]
    )

    return (
      <ControlledFormView style={style}>
        {itemEntries.map(([key, val], index) => (
          <FieldWrapper key={key}>
            <FieldLabel>{get(labels, key, key)}</FieldLabel>
            {isReadOnly(key)
              ? renderReadOnlyField(val)
              : renderInput(key, val, onValueChange(key))}
          </FieldWrapper>
        ))}
        <FieldWrapper
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginLeft: 'auto',
          }}>
          {children}
          <ActionsWrapper>
            <Button style={{ marginRight: '1rem' }} disabled={doneDisabled} onClick={onDone}>
              {doneLabel}
            </Button>
            <Button buttonStyle={ButtonStyle.SECONDARY} onClick={onCancel}>
              Peruuta
            </Button>
          </ActionsWrapper>
        </FieldWrapper>
      </ControlledFormView>
    )
  }
)

export default ItemForm
