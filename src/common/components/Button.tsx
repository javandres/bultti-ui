import React from 'react'
import styled, { css } from 'styled-components'
import { useTooltip } from '../../utils/useTooltip'
import Loading from './Loading'
import { observer } from 'mobx-react-lite'

export enum ButtonSize {
  SMALL,
  MEDIUM,
  LARGE,
}

type StyledButtonProps = {
  size?: ButtonSize
  transparent?: boolean
  loading?: boolean
  disabled?: boolean
} & React.PropsWithRef<JSX.IntrinsicElements['button']>

const size2Style = (size: ButtonSize, ...values: string[]): string => {
  return values[size]
}

// Prevent props from being forwarded to the DOM element and triggering an error.
const DOMSafeButtonComponent = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ loading, transparent, size, ...props }, ref) => <button ref={ref} {...props} />
)

export const StyledButton = styled(DOMSafeButtonComponent)<StyledButtonProps>`
  font-family: var(--font-family);
  font-size: ${({ size = ButtonSize.MEDIUM }) => size2Style(size, '0.7rem', '0.875rem', '1.25rem')};
  font-weight: 500;
  appearance: none;
  outline: none;
  border-radius: 2.5rem;
  border: 1px solid
    ${({ disabled, transparent = false }) => (disabled ? 'var(--light-grey)' : 'var(--blue)')};
  background: ${({ disabled, transparent = false }) =>
    disabled ? 'var(--lighter-grey)' : transparent ? 'transparent' : 'var(--blue)'};
  letter-spacing: -0.6px;
  padding: ${({ loading = false, size = ButtonSize.MEDIUM }) =>
    size2Style(
      size,
      `0.25rem 0.5rem 0.25rem ${loading ? '1rem' : '0.5rem'}`,
      `0.4rem 1rem 0.4rem  ${loading ? '1.5rem' : '1rem'}`,
      `1rem 1.65em 1rem ${loading ? '2.1rem' : '1.65rem'}`
    )};
  color: ${({ disabled, transparent }) =>
    disabled ? 'var(--grey)' : transparent ? 'var(--blue)' : 'white'};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  flex: 0 0 auto;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transform: scale(1);
  transition: background-color 0.2s ease-out, transform 0.1s ease-out;

  ${({ disabled, transparent }) =>
    !disabled
      ? css`
          &:hover {
            background: ${transparent ? 'transparent' : 'var(--dark-blue)'};
            border-color: var(--dark-blue);
            color: ${transparent ? 'var(--dark-blue)' : 'white'};
            transform: scale(1.02);
          }
        `
      : ''}
`

export const StyledTextButton = styled(DOMSafeButtonComponent)<{ color?: string }>`
  font-family: var(--font-family);
  font-size: 0.875rem;
  text-decoration: underline;
  color: ${(p) => p.color || '#888'};
  appearance: none;
  outline: none;
  border: 0;
  padding: 0;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  flex: 0 0 auto;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.1s ease-out;
  background: transparent;

  &:hover {
    transform: scale(1.025);
  }
`

const ButtonLoading = styled(Loading).attrs({ inline: true })<{ buttonSize: ButtonSize }>`
  display: flex;
  margin-right: ${({ buttonSize = ButtonSize.MEDIUM }) =>
    size2Style(buttonSize, '0.45rem', '0.75rem', '1rem')};
  margin-left: ${({ buttonSize = ButtonSize.MEDIUM }) =>
    size2Style(buttonSize, '-0.45rem', '-0.75rem', '-1rem')};
`

export type ButtonProps = {
  helpText?: string
  loading?: boolean
} & StyledButtonProps

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({ helpText, children, loading, ...props }, ref: any) => {
    return (
      <StyledButton {...props} loading={loading} {...useTooltip(helpText)} ref={ref}>
        {loading && (
          <ButtonLoading
            color={props.transparent ? 'white' : 'var(--blue)'}
            size={15}
            buttonSize={typeof props.size !== 'undefined' ? props.size : ButtonSize.MEDIUM}
          />
        )}{' '}
        {children}
      </StyledButton>
    )
  }
)

export const TextButton: React.FC<ButtonProps> = observer(
  ({ helpText, children, loading, ...props }) => {
    return (
      <StyledTextButton {...props} loading={loading} {...useTooltip(helpText)}>
        {children}
      </StyledTextButton>
    )
  }
)
