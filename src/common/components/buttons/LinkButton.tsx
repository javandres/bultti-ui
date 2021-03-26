import React from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components/macro'
import { ArrowRight } from '../../icon/ArrowRight'

const StyledLinkButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: inherit;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  padding: 0.75rem 0.75rem 0.75rem 1.25rem;
  margin-bottom: 1rem;
  text-align: left;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--dark-grey);
  transform: scale(1);
  transition: all 0.1s ease-out;

  &:hover {
    background-color: #fafafa;
    transform: ${({ disabled = false }) => (!disabled ? 'scale(1.01)' : 'scale(1)')};
  }

  svg {
    fill: var(--blue);
    height: 1.25rem;
    width: 1.25rem;
    margin-left: 1rem;
  }
`

type LinkButtonProps = {} & React.PropsWithRef<JSX.IntrinsicElements['button']>

export const LinkButton: React.FC<LinkButtonProps> = observer(({ children, ...props }) => {
  return (
    <StyledLinkButton {...props}>
      {children}
      <ArrowRight />
    </StyledLinkButton>
  )
})
