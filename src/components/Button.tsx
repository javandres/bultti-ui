import React from 'react'
import styled from 'styled-components'
import { useTooltip } from '../utils/useTooltip'
import Loading from './Loading'

export enum ButtonSize {
  SMALL,
  MEDIUM,
  LARGE,
}

type StyledButtonProps = {
  size?: ButtonSize
  transparent?: boolean
  loading?: boolean
} & React.PropsWithRef<JSX.IntrinsicElements['button']>

const size2Style = (size: ButtonSize, ...values: string[]): string => {
  return values[size]
}

// Prevent props from being forwarded to the DOM element and triggering an error.
const DOMSafeButtonComponent = ({ loading, transparent, size, ...props }) => (
  <button {...props} />
)

export const StyledButton = styled(DOMSafeButtonComponent)<StyledButtonProps>`
  font-family: var(--font-family);
  font-size: ${({ size = ButtonSize.MEDIUM }) =>
    size2Style(size, '0.7rem', '0.875rem', '1.25rem')};
  font-weight: 500;
  appearance: none;
  outline: none;
  border-radius: 2.5rem;
  border: 1px solid
    ${({ transparent = false }) => (transparent ? 'var(--light-grey)' : 'var(--blue)')};
  background: ${({ transparent = false }) => (transparent ? 'transparent' : 'var(--blue)')};
  letter-spacing: -0.6px;
  padding: ${({ loading = false, size = ButtonSize.MEDIUM }) =>
    size2Style(
      size,
      `0.25rem 0.5rem 0.25rem ${loading ? '1rem' : '0.5rem'}`,
      `0.4rem 1rem 0.4rem  ${loading ? '1.5rem' : '1rem'}`,
      `1rem 1.65em 1rem ${loading ? '2.1rem' : '1.65rem'}`
    )};
  color: white;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  flex: 0 0 auto;
  cursor: pointer;
  transform: scale(1) translateZ(0);
  transition: background-color 0.2s ease-out, transform 0.1s ease-out;

  &:hover {
    background: var(--dark-blue);
    transform: scale(1.05);
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
