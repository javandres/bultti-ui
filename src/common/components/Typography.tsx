import styled from 'styled-components'

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
