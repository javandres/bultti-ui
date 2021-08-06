import React, { InputHTMLAttributes, RefObject, useCallback } from 'react'
import styled, { css } from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { InputLabel } from '../components/form'

const InputView = styled.div``

export const TextInput = styled.input<{
  readOnly?: boolean
  disabled?: boolean
}>`
  font-family: var(--font-family);
  background: ${(p) => (p.readOnly || p.disabled ? 'var(--disabled-grey)' : 'white')};
  color: var(--dark-grey);
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: ${(p) => (p.readOnly || p.disabled ? '1px solid #ededed' : '1px solid #dadada')};
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
            background: #fafafa;
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
  hintText?: string
  inputComponent?: React.ComponentType
  tabIndex?: number
  onChange?: (value: string) => unknown
  onEnterPress?: (value?: string) => unknown
  onEscPress?: () => unknown
  ref?: RefObject<HTMLInputElement>
  testId?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const Input: React.FC<PropTypes> = observer(
  ({
    ref,
    className,
    value = '',
    label,
    subLabel,
    type = 'text',
    hintText,
    inputComponent = TextInput,
    tabIndex,
    onChange,
    onEnterPress,
    onEscPress,
    testId,
    ...inputProps
  }) => {
    const onValueChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <InputLabel subLabel={subLabel} hintText={hintText}>
            {label}
          </InputLabel>
        )}
        <InputComponent
          {...inputProps}
          data-cy={testId}
          ref={ref}
          type={type}
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
