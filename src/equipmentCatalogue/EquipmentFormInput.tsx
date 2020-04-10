import React, { useCallback, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { CellContent } from '../common/components/Table'
import styled from 'styled-components'
import Dropdown from '../common/input/Dropdown'
import SelectDate from '../common/input/SelectDate'
import { get } from 'lodash'
import { TextInput } from '../common/input/Input'

export const FormInput = styled(TextInput).attrs(() => ({ theme: 'light' }))`
  font-family: var(--font-family);
  font-size: 0.75rem;
`

export const FormDropdown = styled(Dropdown)`
  width: 100%;

  button {
    font-family: var(--font-family);
    padding: 0.715rem 1rem;
    border: 1px solid #eaeaea;
    background: transparent;
    width: 100%;
    font-size: 0.75rem;

    &:hover {
      background: #fafafa;
      border-color: var(--blue);
      color: var(--dark-grey);
    }
  }
`

type ValueType = string | number

export type PropTypes = {
  value: ValueType
  valueName: string
  onChange: (value: ValueType, key: string) => unknown
  onAccept?: () => unknown
  onCancel?: () => unknown
}

type SelectValue = {
  name: string
  label: string
}

const emissionClassValues: SelectValue[] = [
  { name: '', label: '...' },
  { name: '1', label: 'Euro 3' },
  { name: '2', label: 'Euro 4' },
  { name: '3', label: 'Euro 3 CNG' },
  { name: '4', label: 'Euro 5' },
  { name: '5', label: 'EEV Di' },
  { name: '6', label: 'EEV eteho.' },
  { name: '7', label: 'EEV CNG' },
  { name: '8', label: 'Euro 6' },
  { name: '9', label: 'Euro 6 eteho.' },
  { name: '10', label: 'Sähkö' },
]

const typeValues: SelectValue[] = [
  { name: '', label: '...' },
  { name: 'A1', label: 'A1' },
  { name: 'A2', label: 'A2' },
  { name: 'B', label: 'B' },
  { name: 'C', label: 'C' },
  { name: 'D', label: 'D' },
]

const numericTypes = ['offeredPercentageQuota', 'percentageQuota', 'meterRequirement']
const dateValues = ['registryDate']

const EquipmentFormInput: React.FC<PropTypes> = observer(
  ({ value, valueName, onChange, onAccept, onCancel }) => {
    const isDisabled = valueName === 'id'
    const valueIsNumeric = numericTypes.includes(valueName)

    const onChangeValue = useCallback(
      (e) => {
        let nextValue = e.target.value

        if (valueIsNumeric) {
          let floatVal = parseFloat(nextValue)
          nextValue = !nextValue || isNaN(floatVal) ? '' : floatVal
        }

        onChange(nextValue, valueName)
      },
      [onChange, valueIsNumeric, valueName]
    )

    const onSelectValue = useCallback(
      (selectedValue) => {
        onChange(get(selectedValue, 'name', selectedValue), valueName)
      },
      [onChange, valueName]
    )

    const onKeyPress = useCallback(
      (e) => {
        switch (e.key) {
          case 'Enter':
            onAccept && onAccept()
            break
          case 'Esc':
          case 'Escape':
            onCancel && onCancel()
            break
        }
      },
      [onChangeValue, onAccept, onCancel]
    )

    const dropdownProps = useMemo(
      () => ({
        theme: 'light',
        onSelect: onSelectValue,
        itemToString: 'name',
        itemToLabel: 'label',
      }),
      [onSelectValue]
    )

    if (isDisabled) {
      return <CellContent>{value}</CellContent>
    }

    if (valueName === 'emissionClass') {
      return (
        <FormDropdown
          {...dropdownProps}
          items={emissionClassValues}
          selectedItem={
            emissionClassValues.find(({ name }) => name === value + '') || emissionClassValues[0]
          }
        />
      )
    }

    if (valueName === 'type') {
      return (
        <FormDropdown
          {...dropdownProps}
          items={typeValues}
          selectedItem={typeValues.find(({ name }) => name === value) || typeValues[0]}
        />
      )
    }

    if (dateValues.includes(valueName)) {
      return (
        <SelectDate onChange={onSelectValue} value={value as string} label="" name="registryDate" />
      )
    }

    return (
      <FormInput
        type={valueIsNumeric ? 'number' : 'text'}
        step={valueIsNumeric ? 0.01 : 1}
        value={value}
        onChange={onChangeValue}
        name={valueName}
        onKeyDown={onKeyPress}
      />
    )
  }
)

export default EquipmentFormInput
