import React, { InputHTMLAttributes, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ThemeTypes } from '../../type/common'
import { InputLabel } from '../components/form'

const InputView = styled.div``

export const TextInput = styled.input<{
  theme: ThemeTypes
  readOnly?: boolean
  disabled?: boolean
}>`
  font-family: var(--font-family);
  background: ${(p) =>
    p.theme === 'light' ? (p.readOnly || p.disabled ? '#f8f8f8' : 'white') : 'white'};
  color: var(--dark-grey);
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: ${(p) =>
    p.readOnly || p.disabled
      ? '1px solid #ededed'
      : p.theme === 'light'
      ? '1px solid #dadada'
      : '1px solid var(--dark-blue)'};
  font-size: 1rem;
  justify-content: flex-start;
  outline: 0;
  transition: all 0.2s ease-out;

  ${(p) =>
    !p.readOnly
      ? css`
          &:focus {
            background: ${(p) => (p.theme === 'light' ? '#fafafa' : 'var(--white-grey)')};
            transform: scale(1.01);
            border-color: var(--blue);
            color: var(--dark-grey);
          }
        `
      : ''}
`

export const TextArea = styled(TextInput).attrs(() => ({ as: 'textarea', rows: 3 }))`
  line-height: 1.4;
`

export type PropTypes = {
  className?: string
  label?: string
  subLabel?: boolean
  value: string
  onChange?: (value: string) => unknown
  onEnterPress?: (value?: string) => unknown
  theme?: ThemeTypes
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const Input: React.FC<PropTypes> = observer(
  ({
    className,
    value = '',
    onChange,
    theme = 'light',
    label,
    subLabel,
    onEnterPress,
    type = 'text',
    ...inputProps
  }) => {
    const onValueChange = useCallback(
      (e) => {
        const nextVal = e.target.value

        if (typeof onChange === 'function') {
          onChange(nextVal)
        }
      },
      [onChange]
    )

    const onKeyPress = useCallback(
      (e) => {
        if (onEnterPress && e.which === 13) {
          onEnterPress(value)
        }
      },
      [onEnterPress, value]
    )

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
          value={value}
          onChange={onValueChange}
          onKeyPress={onKeyPress}
        />
      </InputView>
    )
  }
)

export default Input
