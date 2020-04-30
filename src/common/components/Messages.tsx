import styled from 'styled-components'

export const MessageContainer = styled.div`
  padding: 0 1rem;
`
export const MessageView = styled.div`
  margin: 1rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--light-blue);
  color: var(--dark-grey);
  background: var(--lightest-blue);
  padding: 0.75rem;
`
export const ErrorView = styled(MessageView)`
  border: 1px solid var(--light-red);
  background: var(--lighter-red);
`
export const EmptyView = styled(MessageView)`
  background: #f8f8f8;
  border-color: #ccc;
`