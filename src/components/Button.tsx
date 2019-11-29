import React from 'react'
import styled from 'styled-components'
import { useTooltip } from '../utils/useTooltip'

export const StyledButton = styled.button<
  {
    small?: boolean
    transparent?: boolean
    primary?: boolean
  } & React.PropsWithRef<JSX.IntrinsicElements['button']>
>`
  font-family: var(--font-family);
  font-size: ${({ small = false }) => (small ? '0.75rem' : '1rem')};
  font-weight: 500;
  appearance: none;
  outline: none;
  border-radius: 2.5rem;
  border: 1px solid ${({ transparent = false }) => (!transparent ? 'var(--blue)' : 'white')};
  background: ${({ primary = false, transparent = false }) =>
    primary ? 'var(--blue)' : transparent ? 'transparent' : 'white'};
  letter-spacing: -0.6px;
  padding: ${({ small = false }) => (small ? '0.25rem 1.25rem' : '1rem 1.65em')};
  color: ${({ primary = false, transparent = false }) =>
    primary || transparent ? 'white' : 'var(--blue)'};
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
    background: ${({ primary = false, transparent }) =>
      primary || transparent ? 'var(--dark-blue)' : '#eeeeee'};
    transform: scale(1.05) translateZ(10px);
  }
`

export type ButtonProps = {
  helpText?: string
}

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({ helpText, ...props }, ref: any) => (
    <StyledButton {...props} {...useTooltip(helpText)} ref={ref} />
  )
)
