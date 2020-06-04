import React, { ChangeEventHandler, CSSProperties } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const CheckboxView = styled.div``

const CheckboxInput = styled.input``

export const CheckboxLabel = styled.label<{ checked: boolean }>`
  padding: 0.3rem 0.5rem 0.3rem 0.75rem;
  display: flex;
  align-items: center;
  background: ${(p) => (p.checked ? 'var(--blue)' : 'white')};
  border: 1px solid ${(p) => (p.checked ? 'var(--blue)' : '#cccccc')};
  color: ${(p) => (p.checked ? 'white' : 'var(--dark-grey)')};
  border-radius: 2rem;
`

const LabelText = styled.span`
  margin-right: 0.25rem;
  user-select: none;
  display: inline-flex;
  align-items: center;
`

export type PropTypes = {
  checked: boolean
  disabled?: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  value: string
  name: string
  label: string
  className?: string
  style?: CSSProperties
}

const Checkbox: React.FC<PropTypes> = observer(
  ({ className, style, disabled = false, checked, onChange, value, name, label }) => {
    return (
      <CheckboxView className={className} style={style}>
        <CheckboxLabel checked={checked}>
          <LabelText>{label}</LabelText>
          <CheckboxInput
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            value={value}
            name={name}
          />
        </CheckboxLabel>
      </CheckboxView>
    )
  }
)

export default Checkbox
