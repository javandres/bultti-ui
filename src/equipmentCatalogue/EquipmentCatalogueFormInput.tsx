import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import DatePicker from '../common/input/DatePicker'

type ValueType = string | number

export type PropTypes = {
  value: ValueType
  valueName: string
  onChange: (value: ValueType, key: string) => void
}

const EquipmentCatalogueFormInput: React.FC<PropTypes> = observer(
  ({ value = '', valueName, onChange }) => {
    const onSelectValue = useCallback(
      (selectedValue) => {
        onChange(selectedValue, valueName)
      },
      [onChange]
    )
    return <DatePicker onChange={onSelectValue} value={value as string} label="" />
  }
)

export default EquipmentCatalogueFormInput
