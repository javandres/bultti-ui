import styled from 'styled-components'
import { TabsWrapper } from './Tabs'
import { StyledButton } from './Button'

export const PageTitle = styled.h2`
  border-bottom: 1px solid var(--lighter-grey);
  padding: 1rem;
  margin-bottom: 1.5rem;
  margin-left: 0;
  margin-top: 0;
  background: white;
  display: flex;
  align-items: center;

  & + ${TabsWrapper} {
    border-top: 1px solid white;
    margin-top: calc(-1.5rem - 1px);
  }

  & > ${StyledButton} {
    margin-left: auto;
  }
`

export const Heading = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: normal;
`

export const SectionHeading = styled(Heading)`
  margin-top: 2rem;
  user-select: none;
  color: var(--dark-grey);

  &:first-child {
    margin-top: 0;
  }
`
export const SubHeading = styled.h4`
  font-size: 1.25rem;
  font-weight: normal;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  user-select: none;

  &:first-child {
    margin-top: 0;
  }
`
