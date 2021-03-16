import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { useCombobox } from 'downshift'
import { Button, ButtonSize } from '../components/Button'
import { ArrowDown } from '../icon/ArrowDown'
import { observer } from 'mobx-react-lite'
import { InputLabel } from '../components/form'
import { TextInput } from './Input'

const AutoCompleteView = styled.div``

const AutoCompleteInput = styled(TextInput)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  z-index: 120;

  &:focus {
    transform: none;

    & + * {
      border-color: var(--blue) !important;
    }
  }
`

const AutoCompleteWrapper = styled.div`
  position: relative;
  display: flex;
`

const MenuButton = styled(Button).attrs({ size: ButtonSize.MEDIUM })<{
  disabled?: boolean
}>`
  background: ${(p) => (p.disabled ? 'transparent' : 'var(--white-grey)')};
  color: ${(p) => (p.disabled ? 'var(--dark-grey)' : 'white')};
  padding: 0.75rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
  border-color: var(--lighter-grey);
  border-left: 0;
  justify-content: flex-start;
  position: relative;
  z-index: 120;
  transition: all 0.2s ease-out;

  svg {
    margin: 0;
    display: ${(p) => (p.disabled ? 'none' : 'block')};
  }

  ${(p) =>
    !p.disabled
      ? css`
          &:hover {
            transform: none;
            background: var(--lighter-grey);
            border-color: var(--lighter-grey);

            svg * {
              fill: var(--dark-grey);
            }
          }
        `
      : ''}
`

const SuggestionsList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  width: 100%;
  border-radius: 0 0 0.5rem 0.5rem;
  background: var(--dark-grey);
  max-height: 265px;
  overflow-y: auto;
  position: absolute;
  z-index: 100;
  outline: 0;
  top: calc(100% - 1rem);
  left: 0;
  padding: 0.5rem 0 0;
  margin: 0;
  border: 1px solid var(--dark-blue);
  border-top: 0;
  opacity: ${(p) => (p.isOpen ? 1 : 0)};
`

const SuggestionItem = styled.li<{ highlighted: boolean }>`
  color: white;
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: ${(p) => (p.highlighted ? 'var(--dark-blue)' : 'transparent')};

  &:first-child {
    padding-top: 1.25rem;
  }
`

export type AutoCompleteProps = {
  disabled?: boolean
  label?: string
  items: any[]
  onSelect: (selectedItem: any | null) => unknown
  itemToString?: string | ((item: any | null) => string)
  itemToLabel?: string | ((item: any | null) => string)
  selectedItem?: any
  className?: string
  style?: CSSProperties
}

function toString(item, converter?: string | ((item) => string)) {
  if (typeof item === 'string') {
    return item
  }

  if (item && typeof converter === 'string') {
    return item[converter]
  }

  if (typeof converter === 'function') {
    return converter(item)
  }

  return ''
}

const AutoComplete: React.FC<AutoCompleteProps> = observer(
  ({
    disabled = false,
    className,
    style = {},
    label,
    items,
    onSelect,
    selectedItem,
    itemToString = 'id',
    itemToLabel = 'label',
  }) => {
    const [currentValue, setCurrentValue] = useState(
      toString(selectedItem, itemToString) || ''
    )

    const onSelectFn = useCallback(
      ({ selectedItem: nextItem = '' }) => {
        onSelect(nextItem)
        setCurrentValue(toString(nextItem, toString))
      },
      [onSelect]
    )

    const onBlur = useCallback(() => {
      onSelect(currentValue)
    }, [currentValue])

    let currentItems = useMemo(
      () => items.filter((item) => toString(item, itemToString).startsWith(currentValue)),
      [items, currentValue]
    )

    const {
      isOpen,
      highlightedIndex,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getItemProps,
      getInputProps,
      getComboboxProps,
    } = useCombobox({
      items: currentItems,
      inputValue: currentValue,
      selectedItem: selectedItem,
      onSelectedItemChange: onSelectFn,
      onInputValueChange: ({ inputValue }) => setCurrentValue(inputValue),
      itemToString: (item: any) => toString(item, itemToString),
    })

    return (
      <AutoCompleteView className={className} style={style}>
        {!!label && (
          <InputLabel {...getLabelProps()} htmlFor="null">
            {label}
          </InputLabel>
        )}
        <AutoCompleteWrapper {...getComboboxProps()}>
          <AutoCompleteInput {...getInputProps()} disabled={disabled} onBlur={onBlur} />
          {!disabled && (
            <MenuButton
              {...getToggleButtonProps({
                disabled,
              })}>
              <ArrowDown fill="var(--dark-grey)" width="1rem" height="1rem" />
            </MenuButton>
          )}
          <SuggestionsList {...getMenuProps({ disabled })} disabled={disabled} isOpen={isOpen}>
            {currentItems.map((item, index) => (
              <SuggestionItem
                highlighted={highlightedIndex === index}
                {...getItemProps({
                  key: toString(item, itemToString),
                  index,
                  item,
                })}>
                {toString(item, itemToLabel)}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        </AutoCompleteWrapper>
      </AutoCompleteView>
    )
  }
)

export default AutoComplete
