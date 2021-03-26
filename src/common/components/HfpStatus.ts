import styled from 'styled-components/macro'
import { HfpStatus } from '../../schema-types'

export const HfpStatusIndicator = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 0.75rem;

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

export const getHfpStatusColor = (hfpDataStatus: HfpStatus) =>
  hfpDataStatus === HfpStatus.Ready
    ? 'var(--green)'
    : hfpDataStatus === HfpStatus.Loading
    ? 'var(--yellow)'
    : 'var(--red)'
