import React, { CSSProperties, useCallback } from 'react'
import styled, { css } from 'styled-components/macro'
import { useSelect } from 'downshift'
import { text } from '../../util/translate'
import { Button, ButtonSize } from '../components/buttons/Button'
import { ArrowDown } from '../icon/ArrowDown'
import { observer } from 'mobx-react-lite'
import { InputLabel } from '../components/form'

const DropdownView = styled.div``

const SelectWrapper = styled.div`
  position: relative;
`

const SelectButton = styled(Button).attrs({ size: ButtonSize.MEDIUM })<{
  disabled?: boolean
}>`
  background: ${(p) => (p.disabled ? 'transparent' : 'white')};
  color: var(--dark-grey);
  background: ${(p) => (p.disabled ? 'var(--disabled-grey)' : 'white')};
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.disabled ? '#eaeaea' : 'var(--lighter-grey)')};
  font-size: 1rem;
  justify-content: flex-start;
  display: flex;

  svg {
    display: ${(p) => (p.disabled ? 'none' : 'block')};
    margin-left: auto;
    margin-right: 0;
  }

  ${(p) =>
    !p.disabled
      ? css`
          &:hover {
            background: #fafafa;
            color: var(--dark-grey);
            border-color: var(--blue);
            svg * {
              fill: var(--blue);
            }
          }
        `
      : ''}
`

const SuggestionsList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  width: 100%;
  min-width: 5rem;
  border-radius: 8px;
  background: white;
  max-height: 265px;
  overflow-y: auto;
  position: absolute;
  z-index: 100;
  outline: 0;
  top: -1rem;
  left: 0;
  padding: 0;
  border: 1px solid var(--blue);
  opacity: ${(p) => (p.isOpen ? 1 : 0)};
`

const DropdownItem = styled.li<{ highlighted: boolean }>`
  color: ${(p) => (p.highlighted ? 'white' : 'var(--dark-grey)')};
  cursor: pointer;
  padding: 0.75rem 1rem;
  text-align: left;
  background: ${(p) => (p.highlighted ? 'var(--dark-blue)' : 'transparent')};
  user-select: none;
`

export type DropdownProps<ValueType = {}> = {
  disabled?: boolean
  label?: string
  items: ValueType[] // ValueType object (remember to pass itemToString, itemToLabel), array, { field, value } object.
  onSelect: (selectedItem: ValueType) => unknown
  unselectedValue?: ValueType
  itemToString?: string | ((item: ValueType) => string) // property of given object to get value from or a function that returns the value.
  itemToLabel?: string | ((item: ValueType) => string | JSX.Element) // property of given object to get label from or a function that returns the label.
  selectedItem?: ValueType
  className?: string
  hintText?: string
  style?: CSSProperties
}

function toString(item, converter?: string | ((item) => string | JSX.Element)) {
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

const Dropdown = observer(
  <ValueType extends {} | string = {}>({
    disabled = false,
    className,
    style = {},
    label,
    items,
    onSelect,
    selectedItem,
    hintText,
    itemToString = 'id',
    itemToLabel = 'label',
    unselectedValue,
  }: DropdownProps<ValueType>) => {
    const onSelectFn = useCallback(
      ({ selectedItem = unselectedValue }) => {
        onSelect(selectedItem)
      },
      [onSelect]
    )

    const {
      isOpen,
      selectedItem: currentlySelected,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
    } = useSelect({
      items,
      onSelectedItemChange: onSelectFn,
      selectedItem,
      defaultSelectedItem: items[0] || unselectedValue,
      itemToString: (item) => toString(item, itemToString),
    })

    let buttonLabel =
      toString(currentlySelected, itemToLabel) ||
      toString(unselectedValue, itemToLabel) ||
      text('all')

    return (
      <DropdownView className={className} style={style}>
        {!!label && (
          <InputLabel {...getLabelProps()} htmlFor="null" hintText={hintText}>
            {label}
          </InputLabel>
        )}
        <SelectWrapper>
          <SelectButton
            {...getToggleButtonProps({
              disabled,
            })}>
            {typeof buttonLabel === 'string' ? <span>{buttonLabel}</span> : buttonLabel}
            <ArrowDown fill="var(--dark-grey)" width="1rem" height="1rem" />
          </SelectButton>

          <SuggestionsList
            {...getMenuProps({ disabled: disabled })}
            disabled={disabled}
            isOpen={isOpen}>
            {!disabled && isOpen && (
              <>
                {items.map((item, index) => (
                  <DropdownItem
                    key={`dropdown-item-${index}`}
                    highlighted={highlightedIndex === index}
                    {...getItemProps({
                      key: toString(item, itemToString),
                      index,
                      item,
                    })}>
                    {toString(item, itemToLabel)}
                  </DropdownItem>
                ))}
              </>
            )}
          </SuggestionsList>
        </SelectWrapper>
      </DropdownView>
    )
  }
)

export default Dropdown
