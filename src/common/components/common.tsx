import styled from 'styled-components'
import { ThemeTypes } from '../../type/common'

export const Page = styled.div``

export const PageSection = styled.div`
  padding: 0 1rem 0 1.5rem;
  margin: 1rem 0;
`

export const PageTitle = styled.h2`
  border-bottom: 1px solid var(--light-grey);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-left: 1rem;
`

export const Subtitle = styled.h3`
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
`

export const Heading = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`

export const ColumnWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: row;
  flex-wrap: nowrap;
`

export const Column = styled.div<{ width?: string; minWidth?: string }>`
  padding: 1rem 1.5rem;
  min-width: ${(p) => p.minWidth || '0'};
  flex: 1 1 ${(p) => p.width || '50%'};
`

export const HalfWidth = styled(Column).attrs(() => ({ width: '50%', minWidth: '0' }))``

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

export const FlexColumn = styled.div``

export const InputLabel = styled.label<{ theme: ThemeTypes; subLabel?: boolean }>`
  display: block;
  font-size: ${(p) => (p.subLabel ? '0.65rem' : '0.875rem')};
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme = 'light' }) => (theme === 'light' ? 'var(--dark-grey)' : '#eeeeee')};
  margin: 0;
  padding-bottom: 0.5rem;
`

export const FormHeading = styled.h5<{ theme: ThemeTypes }>`
  font-size: 1.15rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: ${({ theme = 'light' }) => (theme === 'light' ? 'var(--dark-grey)' : '#eeeeee')};

  &:first-child {
    margin-top: 0;
  }
`

export const SectionHeading = styled(FormHeading)`
  margin-top: 2rem;
  margin-left: 1rem;
`

export const MessageContainer = styled.div`
  padding: 0 1rem;
`

export const MessageView = styled.div`
  margin-top: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--light-blue);
  color: var(--dark-grey);
  background: var(--lightest-blue);
  padding: 0.75rem;
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

export const ErrorView = styled(MessageView)`
  border: 1px solid var(--light-red);
  background: var(--lighter-red);
`
