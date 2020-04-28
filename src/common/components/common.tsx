import styled from 'styled-components'
import { TabsWrapper } from './Tabs'
import { StyledButton } from './Button'

export const Page = styled.div``

export const PageSection = styled.div`
  padding: 0 1rem 0 1.5rem;
  margin: 1rem 0;
`

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
