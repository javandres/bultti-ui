import React, { useCallback } from 'react'
import styled, { CSSProperties } from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { get } from 'lodash'
import { TextInput } from './Input'
import { Button, ButtonStyle } from '../components/buttons/Button'
import { useOrderedValues } from '../../util/useOrderedValues'
import { useWatchDirtyForm } from '../../util/promptUnsavedChanges'
import UserHint from '../components/UserHint'
import { Text } from '../../util/translate'

export const ControlledFormView = styled.div<{ frameless?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: ${(p) => (p.frameless ? '0' : '1px solid var(--lighter-grey)')};
  border-radius: 0.5rem;
  background: white;

  > *:nth-child(2n + 2n) {
    background-color: #fafafa;
  }

  > *:nth-child(2) {
    border-top-right-radius: 0.5rem;
  }
`

export const FieldWrapper = styled.div<{ frameless?: boolean; fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: ${(p) => (p.fullWidth ? '1 0 100%' : '1 1 50%')};
  width: auto;
  padding: ${(p) => (p.frameless ? '0 0 1.5rem' : '1rem')};
  border-right: ${(p) => (p.frameless || p.fullWidth ? '0' : '1px solid var(--lighter-grey)')};
  border-bottom: ${(p) => (p.frameless ? '0' : '1px solid var(--lighter-grey)')};

  &:nth-child(2n),
  &:last-child {
    border-right: 0;
    padding-left: ${(p) =>
      p.frameless && !p.fullWidth ? '1.5rem' : p.frameless ? 0 : '1rem'};
  }

  &:last-child {
    padding-bottom: ${(p) => (p.frameless ? '0' : '1rem')};
  }

  textarea {
    resize: vertical;
  }
`

export const FieldLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  user-select: none;
`

export const FieldValueDisplay = styled.div`
  padding: 0.5rem 0;
  border: 0;
  background: transparent;
  display: block;
  width: 100%;
  line-height: 1.4;
`

export const ActionsWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
`

type LabelsType<ItemType extends Record<string, unknown>> = {
  [key in keyof ItemType]?: string
}

type HintsType<ItemType extends Record<string, unknown>> = { [key in keyof ItemType]?: string }

export type PropTypes<ItemType extends Record<string, unknown>> = {
  item: ItemType
  children?: React.ReactChild
  onChange: (key: string, value: string) => void
  onDone: () => void
  onCancel?: () => void
  readOnly?: boolean | string[]
  doneLabel?: string
  doneDisabled?: boolean
  isDirty?: boolean
  dirtyFormCheckIsEnabled?: boolean
  labels?: LabelsType<ItemType>
  hints?: HintsType<ItemType>
  order?: string[]
  hideKeys?: string[]
  editableValues?: string[]
  keyFromItem?: (item: ItemType) => string
  renderLabel?: (
    key: string,
    val: unknown,
    labels: LabelsType<ItemType>,
    hints: HintsType<ItemType>
  ) => React.ReactChild | false
  renderInput?: (
    key: string,
    val: unknown,
    onChange: (val: unknown) => void,
    item: ItemType,
    readOnly: boolean,
    loading?: boolean,
    onReset?: () => unknown
  ) => React.ReactChild
  style?: CSSProperties
  frameless?: boolean
  loading?: boolean
  fullWidthFields?: string[]
  showButtons?: boolean
  testId?: string
}

const renderReadOnlyField = (val) => <FieldValueDisplay>{val}</FieldValueDisplay>

const defaultRenderInput = (key, val, onChange, item, readOnly = false) =>
  readOnly ? (
    renderReadOnlyField(val)
  ) : (
    <TextInput type="text" value={val} onChange={(e) => onChange(e.target.value)} name={key} />
  )

const defaultRenderLabel = (key, val, labels, hints) => (
  <FieldLabel>
    {get(labels, key, key)}
    <UserHint hintText={get(hints, key, '')} />
  </FieldLabel>
)

const ItemForm = observer(
  <ItemType extends Record<string, unknown>>({
    item,
    children,
    labels = {},
    hints = {},
    order,
    hideKeys,
    onChange,
    readOnly = false,
    onDone,
    onCancel,
    doneDisabled = false,
    isDirty = true,
    dirtyFormCheckIsEnabled = true,
    doneLabel = 'Tallenna',
    renderInput = defaultRenderInput,
    renderLabel = defaultRenderLabel,
    style,
    frameless = false,
    loading = false,
    fullWidthFields = [],
    showButtons = true,
    testId,
  }: PropTypes<ItemType>) => {
    const itemEntries = useOrderedValues(item, labels, order, hideKeys)

    const onValueChange = useCallback(
      (key) => (nextValue) => {
        onChange(key, nextValue)
      },
      [onChange]
    )

    let isReadOnly = useCallback(
      (key) => (typeof readOnly === 'boolean' ? readOnly : (readOnly || []).includes(key)),
      [readOnly]
    )

    useWatchDirtyForm(dirtyFormCheckIsEnabled && isDirty)

    return (
      <ControlledFormView style={style} frameless={frameless} data-cy={testId}>
        {itemEntries.map(([key, val], index) => {
          let renderedLabel = renderLabel(key, val, labels, hints)
          return (
            <FieldWrapper
              key={key}
              frameless={frameless}
              fullWidth={fullWidthFields?.includes(key)}>
              {renderedLabel !== false && renderedLabel}
              {renderInput(
                key,
                val,
                onValueChange(key),
                item,
                isReadOnly(key),
                loading,
                onCancel
              )}
            </FieldWrapper>
          )
        })}
        {showButtons && (
          <FieldWrapper
            fullWidth={fullWidthFields?.includes('actions')}
            frameless={frameless}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginLeft: 'auto',
            }}>
            {children}
            <ActionsWrapper>
              <Button
                data-cy="item_form_save_button"
                loading={loading}
                style={{ marginRight: '1rem' }}
                disabled={doneDisabled || (dirtyFormCheckIsEnabled && !isDirty)}
                onClick={onDone}>
                {doneLabel}
              </Button>
              {onCancel && (
                <Button buttonStyle={ButtonStyle.SECONDARY_REMOVE} onClick={onCancel}>
                  <Text>cancel</Text>
                </Button>
              )}
            </ActionsWrapper>
          </FieldWrapper>
        )}
      </ControlledFormView>
    )
  }
)

export default ItemForm
