import React, { ChangeEventHandler, CSSProperties } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ToggleLabel from './ToggleLabel'

const CheckboxView = styled.div``

const CheckboxInput = styled.input``

export type PropTypes = {
  checked: boolean
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  value: string
  name: string
  label: string
  loading?: boolean
  className?: string
  style?: CSSProperties
}

const Checkbox: React.FC<PropTypes> = observer(
  ({ className, style, disabled = false, loading, checked, onChange, value, name, label }) => {
    return (
      <CheckboxView className={className} style={style}>
        <ToggleLabel checked={checked} loading={loading} label={label}>
          <CheckboxInput
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            value={value}
            name={name}
          />
        </ToggleLabel>
      </CheckboxView>
    )
  }
)

export default Checkbox
