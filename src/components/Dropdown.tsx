import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useSelect } from 'downshift'
import { Operator } from '../schema-types'
import { text } from '../utils/translate'
import { Button, ButtonSize } from './Button'

const DropdownView = styled.div``

const InputLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #eeeeee;
  margin: 2rem 0 0;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  border-bottom: 1px solid var(--dark-blue);
`

const SelectWrapper = styled.div`
  padding: 1rem;
  position: relative;
`

const SelectButton = styled(Button).attrs({ size: ButtonSize.MEDIUM })`
  background: white;
  color: var(--dark-grey);
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 7px;
  border: 0;
  font-size: 1rem;
  justify-content: flex-start;
`

const SuggestionsList = styled.ul`
  list-style: none;
  width: calc(100% - 2rem);
  border-radius: 7px;
  background: white;
  max-height: 250px;
  overflow-y: auto;
  position: absolute;
  outline: 0;
  top: 0;
  left: 1rem;
  padding: 0;
`

const OperatorSuggestion = styled.li<{ highlighted: boolean }>`
  color: ${(p) => (p.highlighted ? 'white' : 'var(--dark-grey)')};
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: ${(p) => (p.highlighted ? 'var(--dark-blue)' : 'transparent')};
`

export type DropdownProps<T = any> = {
  label: string
  items: T[]
  onSelect: (selectedItem: T | null) => unknown
  itemToString: string | ((item: T | null) => string)
  itemToLabel: string | ((item: T | null) => string)
  selectedItem?: T
  className?: string
}

function toString(item, converter) {
  if (item && typeof converter === 'string') {
    return item[converter]
  }

  if (typeof converter === 'function') {
    return converter(item)
  }

  return ''
}

const Dropdown: React.FC<any> = <T extends {}>({
  className,
  label,
  items,
  onSelect,
  selectedItem,
  itemToString = 'id',
  itemToLabel = 'label',
}: DropdownProps<T>) => {
  const onSelectFn = useCallback(
    ({ selectedItem = null }) => {
      onSelect(selectedItem || null)
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
  } = useSelect<T>({
    items,
    onSelectedItemChange: onSelectFn,
    selectedItem,
    defaultSelectedItem: items[0],
    itemToString: (item: T) => toString(item, itemToString),
  })

  return (
    <DropdownView className={className}>
      <InputLabel {...getLabelProps()}>{label}</InputLabel>
      <SelectWrapper>
        <SelectButton {...getToggleButtonProps()}>
          {toString(currentlySelected, itemToLabel) || text('general.app.all')}
        </SelectButton>
        <SuggestionsList {...getMenuProps()}>
          {isOpen
            ? items.map((item, index) => (
                <OperatorSuggestion
                  highlighted={highlightedIndex === index}
                  {...getItemProps({
                    key: toString(item, itemToString),
                    index,
                    item,
                  })}>
                  {toString(item, itemToLabel)}
                </OperatorSuggestion>
              ))
            : null}
        </SuggestionsList>
      </SelectWrapper>
    </DropdownView>
  )
}

export default Dropdown
