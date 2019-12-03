import styled from 'styled-components'
import { StyledButton } from './Button'

export const LoginButton = styled(StyledButton)`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  user-select: none;
  cursor: pointer;

  svg + .buttonText {
    margin-left: 1rem;
  }
`

export const Page = styled.div`
  > *:first-child {
    margin-top: 0;
  }
`

export const PageSection = styled.div`
  padding: 0 1rem;
  margin: 1rem 0;
`
