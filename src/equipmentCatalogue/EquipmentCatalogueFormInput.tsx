import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { TextInput } from '../common/input/Input'
import Dropdown from '../common/input/Dropdown'
import SelectDate from '../common/input/SelectDate'

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

    return <SelectDate onChange={onSelectValue} value={value as string} label="" name={valueName} />
  }
)

export default EquipmentCatalogueFormInput
