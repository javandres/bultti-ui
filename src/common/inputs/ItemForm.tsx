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
  border-bottom: 0;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 0 5px 0 rgba(0,20,50,0.1);

  > *:nth-child(2n+2n) {
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
  border-bottom: 1px solid var(--lighter-grey);

  &:nth-child(2n),
  &:last-child {
    border-right: 0;
  }
`

const FieldLabel = styled.label`
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
`

const ActionsWrapper = styled.div`
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
        <FieldWrapper
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginLeft: 'auto',
          }}>
          {children}
          <ActionsWrapper>
            <Button style={{ marginRight: '1rem' }} theme="light" transparent={true} onClick={onCancel}>
              Peruuta
            </Button>
            <Button disabled={doneDisabled} onClick={onDone}>
              {doneLabel}
            </Button>
          </ActionsWrapper>
        </FieldWrapper>
      </ControlledFormView>
    )
  }
)

export default ItemForm
