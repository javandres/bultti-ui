import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { TextInput } from '../common/inputs/Input'

export const FormInput = styled(TextInput).attrs(() => ({ theme: 'light' }))`
  font-family: var(--font-family);
  font-size: 0.75rem;
`

type ValueType = string | number

export type PropTypes = {
  value: ValueType
  valueName: string
  onChange: (value: ValueType, key: string) => void
}

const numericTypes = ['weeklyMeters', 'medianAgeRequirement']

const ProcurementUnitFormInput: React.FC<PropTypes> = observer(({ value, valueName, onChange }) => {
  const valueIsNumeric = numericTypes.includes(valueName)

  const onChangeValue = useCallback(
    (e) => {
      let nextValue = e.target.value

      if (valueIsNumeric) {
        const floatVal = parseFloat(nextValue)
        nextValue = !nextValue || isNaN(floatVal) ? '' : floatVal
      }

      onChange(nextValue, valueName)
    },
    [onChange, valueIsNumeric]
  )

  return (
    <FormInput
      type={valueIsNumeric ? 'number' : 'text'}
      step={valueIsNumeric ? 0.1 : 1}
      value={value}
      onChange={onChangeValue}
      name={valueName}
    />
  )
})

export default ProcurementUnitFormInput
