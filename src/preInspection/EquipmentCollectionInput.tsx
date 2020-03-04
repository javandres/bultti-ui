import React, { useCallback, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { CellContent, TableDropdown, TableInput } from '../common/components/Table'
import { isNumeric } from '../utils/isNumeric'

type ValueType = string | number

export type PropTypes = {
  value: ValueType
  valueName: string
  onChange: (value: ValueType, key: string) => void
}

type EmissionSelectValue = {
  name: string
  label: string
}

const emissionClassValues: EmissionSelectValue[] = [
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

const typeValues: EmissionSelectValue[] = [
  { name: '', label: '...' },
  { name: 'A1', label: 'A1' },
  { name: 'A2', label: 'A2' },
  { name: 'C', label: 'C' },
  { name: 'D', label: 'D' },
]

const EquipmentCollectionInput: React.FC<PropTypes> = observer(
  ({ value, valueName, onChange }) => {
    const isDisabled = valueName === 'id'

    const onChangeValue = useCallback(
      (e) => {
        const nextValue = e.target.value
        onChange(nextValue, valueName)
      },
      [onChange]
    )

    const onSelectValue = useCallback(
      (selectedValue) => {
        onChange(selectedValue.name, valueName)
      },
      [onChange]
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
        <TableDropdown
          {...dropdownProps}
          items={emissionClassValues}
          selectedItem={
            emissionClassValues.find(({ name }) => name === value) || emissionClassValues[0]
          }
        />
      )
    }

    if (valueName === 'type') {
      return (
        <TableDropdown
          {...dropdownProps}
          items={typeValues}
          selectedItem={typeValues.find(({ name }) => name === value) || typeValues[0]}
        />
      )
    }

    return (
      <TableInput
        type={isNumeric(value) ? 'number' : 'text'}
        value={value}
        onChange={onChangeValue}
        name={valueName}
      />
    )
  }
)

export default EquipmentCollectionInput
