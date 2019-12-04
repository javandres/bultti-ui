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
  padding: 0 1rem 0 1.5rem;
  margin: 1rem 0;
`

export const PageTitle = styled.h2`
  border-bottom: 1px solid var(--light-grey);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-left: 1.5rem;
`

export const Heading = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`
