import styled from 'styled-components'
import { ThemeTypes } from '../../type/common'

export const Subtitle = styled.h3`
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
`
export const Heading = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: normal;
`
export const FormHeading = styled.h5<{ theme: ThemeTypes }>`
  font-size: 1.15rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 1rem;
  user-select: none;
  color: ${({ theme = 'light' }) => (theme === 'light' ? 'var(--dark-grey)' : '#eeeeee')};

  &:first-child {
    margin-top: 0;
  }
`
export const SectionHeading = styled(FormHeading)`
  margin-top: 2rem;
  margin-left: 1rem;
  user-select: none;
`
export const SubSectionHeading = styled.h5`
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 1rem;
  user-select: none;

  &:first-child {
    margin-top: 0;
  }
`
export const SmallHeading = styled.h6`
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }
`
