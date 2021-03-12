import styled from 'styled-components/macro'

export const DateStatus = styled.div<{ color: string }>`
  display: flex;
  align-items: center;

  &:after {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    background-color: ${(p) => p.color};
    border-radius: 0.5rem;
    margin-left: 0.5rem;
  }
`
