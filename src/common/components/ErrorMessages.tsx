import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components/macro'
import { Button, ButtonSize, ButtonStyle } from './Button'
import { useStateValue } from '../../state/useAppState'

const ErrorsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10;
`

const Error = styled.div`
  padding: 0.33rem 1rem;
  background: var(--red);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  line-height: 1;
  border-top: 1px solid #a72828;
`

const DismissButton = styled(Button)`
  border-color: white;
`

export default observer(function ErrorMessages() {
  let [errorMessage, setErrorMessage] = useStateValue('errorMessage')

  let onDismiss = useCallback(() => {
    setErrorMessage('')
  }, [])

  if (!errorMessage) {
    return null
  }

  return (
    <ErrorsWrapper>
      <Error>
        <span>{errorMessage}</span>
        <DismissButton
          size={ButtonSize.SMALL}
          buttonStyle={ButtonStyle.REMOVE}
          onClick={onDismiss}>
          Dismiss
        </DismissButton>
      </Error>
    </ErrorsWrapper>
  )
})
