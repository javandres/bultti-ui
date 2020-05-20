import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'

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

    return (
      <SelectDate onChange={onSelectValue} value={value as string} label="" name={valueName} />
    )
  }
)

export default EquipmentCatalogueFormInput
