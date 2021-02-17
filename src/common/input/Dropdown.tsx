import React, { CSSProperties, useCallback } from 'react'
import styled, { css } from 'styled-components/macro'
import { useSelect } from 'downshift'
import { text } from '../../util/translate'
import { Button, ButtonSize } from '../components/Button'
import { ArrowDown } from '../icon/ArrowDown'
import { ThemeTypes } from '../../type/common'
import { observer } from 'mobx-react-lite'
import { InputLabel } from '../components/form'

const DropdownView = styled.div``

const SelectWrapper = styled.div`
  position: relative;
`

const SelectButton = styled(Button).attrs({ size: ButtonSize.MEDIUM })<{
  theme: ThemeTypes
  disabled?: boolean
}>`
  background: ${(p) => (p.disabled ? 'transparent' : 'white')};
  color: ${(p) =>
    p.disabled ? (p.theme === 'light' ? 'var(--dark-grey)' : 'white') : 'var(--dark-grey)'};
  background: ${(p) => (p.disabled ? 'var(--disabled-grey)' : 'white')};
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid
    ${(p) =>
      p.theme === 'light'
        ? '#eaeaea'
        : p.disabled
        ? 'var(--lighter-grey)'
        : 'var(--dark-blue)'};
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
            background: ${(p) => (p.theme === 'light' ? '#fafafa' : 'var(--lighter-grey)')};
            color: var(--dark-grey);
            border-color: var(--blue);
            svg * {
              fill: ${(p) => (p.theme === 'light' ? 'var(--blue)' : 'var(--dark-grey)')};
            }
          }
        `
      : ''}
`

const SuggestionsList = styled.ul<{ isOpen: boolean; inverted: ThemeTypes }>`
  list-style: none;
  width: 100%;
  border-radius: 8px;
  background: ${(p) => (p.theme === 'light' ? 'white' : 'var(--dark-grey)')};
  max-height: 265px;
  overflow-y: auto;
  position: absolute;
  z-index: 100;
  outline: 0;
  top: -1rem;
  left: 0;
  padding: 0;
  border: 1px solid ${(p) => (p.theme === 'light' ? 'var(--blue)' : 'var(--dark-blue)')};
  opacity: ${(p) => (p.isOpen ? 1 : 0)};
`

const DropdownItem = styled.li<{ highlighted: boolean }>`
  color: ${(p) =>
    p.highlighted ? 'white' : p.theme === 'light' ? 'var(--dark-grey)' : 'white'};
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: ${(p) => (p.highlighted ? 'var(--dark-blue)' : 'transparent')};
  user-select: none;
`

export type DropdownProps = {
  disabled?: boolean
  label?: string
  items: any[] // any object (remember to pass itemToString, itemToLabel), array, { field, value } object.
  onSelect: (selectedItem: any | null) => unknown
  itemToString?: string | ((item: any | null) => string) // property of given object to get value from or a function that returns the value.
  itemToLabel?: string | ((item: any | null) => string) // property of given object to get label from or a function that returns the label.
  selectedItem?: any // TODO: add documentation of this property or change any
  className?: string
  hintText?: string
  style?: CSSProperties
  theme?: ThemeTypes
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

const Dropdown: React.FC<DropdownProps> = observer(
  ({
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
    theme = 'light',
  }) => {
    const onSelectFn = useCallback(
      ({ selectedItem = null }) => {
        setTimeout(() => onSelect(selectedItem || null), 1)
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
      defaultSelectedItem: items[0],
      itemToString: (item: any) => toString(item, itemToString),
    })

    return (
      <DropdownView className={className} style={style} theme={theme}>
        {!!label && (
          <InputLabel {...getLabelProps()} htmlFor="null" hintText={hintText} theme={theme}>
            {label}
          </InputLabel>
        )}
        <SelectWrapper>
          <SelectButton
            {...getToggleButtonProps({
              disabled,
            })}
            theme={theme}>
            <span>{toString(currentlySelected, itemToLabel) || text('all')}</span>
            <ArrowDown fill="var(--dark-grey)" width="1rem" height="1rem" />
          </SelectButton>

          <SuggestionsList
            {...getMenuProps({ disabled: disabled })}
            disabled={disabled}
            theme={theme}
            isOpen={isOpen}>
            {!disabled && isOpen && (
              <>
                {items.map((item, index) => (
                  <DropdownItem
                    key={`dropdown-item-${index}`}
                    theme={theme}
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
