import React, { InputHTMLAttributes, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InputLabel } from '../components/common'
import { ThemeTypes } from '../types/common'

const InputView = styled.div``

const TextInput = styled.input<{ theme: ThemeTypes }>`
  background: ${(p) => (p.theme === 'light' ? '#fafafa' : 'white')};
  color: var(--dark-grey);
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.theme === 'light' ? '#eaeaea' : 'var(--dark-blue)')};
  font-size: 1rem;
  justify-content: flex-start;
  outline: 0;

  &:focus {
    background: ${(p) => (p.theme === 'light' ? 'white' : 'var(--lighter-grey)')};
    border-color: var(--blue);
    color: var(--dark-grey);
  }
`

export type PropTypes = {
  className?: string
  label?: string
  value: string | number
  onChange?: (value: string) => unknown
  theme?: ThemeTypes
} & InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<PropTypes> = observer(
  ({ className, value, onChange, theme = 'light', label }) => {
    const onValueChange = useCallback(
      (e) => typeof onChange === 'function' && onChange(e.target.value),
      [onChange]
    )

    return (
      <InputView className={className}>
        {!!label && <InputLabel theme={theme}>{label}</InputLabel>}
        <TextInput theme={theme} value={value} onChange={onValueChange} />
      </InputView>
    )
  }
)

export default Input
