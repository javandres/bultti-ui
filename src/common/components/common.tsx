import styled from 'styled-components'

export const Page = styled.div`
  position: relative;
`

export const PageSection = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  width: 100%;
  position: relative;
`

export const TransparentPageSection = styled(PageSection)`
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
`

export const SectionTopBar = styled.div`
  margin: -0.5rem -1rem 1rem;
  padding: 0 0.75rem 0.5rem;
  border-bottom: 1px solid var(--lighter-grey);
  display: flex;
  flex-direction: row;
  align-items: baseline;
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
