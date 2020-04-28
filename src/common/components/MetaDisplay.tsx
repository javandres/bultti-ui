import styled from 'styled-components'
import { LoadingDisplay } from './Loading'

export const MetaDisplay = styled.div`
  display: flex;
`
export const MetaItem = styled.div`
  padding: 0.5rem 0.75rem 0.2rem;
  margin-right: 1rem;
  border: 1px solid var(--lighter-grey);
  border-radius: 5px;
  color: var(--dark-grey);
  margin-bottom: -0.5rem;
`
export const LoadingMeta = styled(LoadingDisplay)`
  margin-right: 1rem;
  align-self: center;
`
export const MetaLabel = styled.h6`
  margin: 0.1rem 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
`
export const MetaValue = styled.div`
  font-size: 0.875rem;
`
