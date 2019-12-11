import React, { InputHTMLAttributes, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InputLabel } from '../components/common'
import { ThemeTypes } from '../types/common'

const InputView = styled.div``

const TextInput = styled.input<{ theme: ThemeTypes }>`
  font-family: var(--font-family);
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
  subLabel?: boolean
  value: string | number
  onChange?: (value: string) => unknown
  reportChange?: (value: string) => boolean
  theme?: ThemeTypes
} & InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<PropTypes> = observer(
  ({
    className,
    value,
    onChange,
    theme = 'light',
    label,
    reportChange,
    subLabel,
    ...inputProps
  }) => {
    const [internalValue, setInternalValue] = useState(value)

    const onValueChange = useCallback(
      (e) => {
        const nextVal = e.target.value
        setInternalValue(nextVal)

        if (typeof onChange === 'function' && (!reportChange || reportChange(nextVal))) {
          onChange(nextVal)
        }
      },
      [onChange]
    )

    useEffect(() => {
      if (value !== internalValue) {
        setInternalValue(value)
      }
    }, [value, internalValue])

    return (
      <InputView className={className}>
        {!!label && (
          <InputLabel subLabel={subLabel} theme={theme}>
            {label}
          </InputLabel>
        )}
        <TextInput
          {...inputProps}
          theme={theme}
          value={internalValue}
          onChange={onValueChange}
        />
      </InputView>
    )
  }
)

export default Input
