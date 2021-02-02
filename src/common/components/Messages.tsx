import styled from 'styled-components/macro'

export const MessageContainer = styled.div`
  padding: 0 1rem;

  &:first-child {
    margin-top: 0;
  }
`
export const MessageView = styled.div`
  margin: 1rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--light-blue);
  color: var(--dark-grey);
  background: var(--lightest-blue);
  padding: 0.75rem;
  line-height: 1.4;

  &:first-child {
    margin-top: 0;
  }
`

export const SuccessView = styled(MessageView)`
  border: 1px solid var(--light-green);
  background: var(--lightest-green);
`

export const ErrorView = styled(MessageView)`
  border: 1px solid var(--light-red);
  background: var(--lighter-red);
`

export const EmptyView = styled(MessageView)`
  background: #f8f8f8;
  border-color: #ccc;
`
