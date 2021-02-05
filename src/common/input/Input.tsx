import React, { InputHTMLAttributes, useCallback } from 'react'
import styled, { css } from 'styled-components/macro'
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
  line-height: 1.3;
  height: 40px;
  vertical-align: baseline;
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
  height: auto;
`
type InputType = 'text' | 'date' | 'number'

export type PropTypes = {
  className?: string
  value: string
  label?: string
  subLabel?: boolean
  type?: InputType
  theme?: ThemeTypes
  hintText?: string
  inputComponent?: React.ComponentType
  tabIndex?: number
  onChange?: (value: string) => unknown
  onEnterPress?: (value?: string) => unknown
  onEscPress?: () => unknown
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const Input: React.FC<PropTypes> = observer(
  ({
    className,
    value = '',
    label,
    subLabel,
    type = 'text',
    theme = 'light',
    hintText,
    inputComponent = TextInput,
    tabIndex,
    onChange,
    onEnterPress,
    onEscPress,
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
        if (onEnterPress && e.key === 'Enter') {
          onEnterPress(value)
        }

        if (onEscPress && e.key === 'Escape') {
          onEscPress()
        }
      },
      [onEnterPress, onEscPress, value]
    )

    let InputComponent = inputComponent

    return (
      <InputView className={className}>
        {!!label && (
          <InputLabel subLabel={subLabel} theme={theme} hintText={hintText}>
            {label}
          </InputLabel>
        )}
        <InputComponent
          {...inputProps}
          type={type}
          theme={theme}
          value={value}
          tabIndex={tabIndex}
          onChange={onValueChange}
          onKeyUp={onKeyPress}
        />
      </InputView>
    )
  }
)

export default Input
