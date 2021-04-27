import React from 'react'
import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components/macro'
import { Button, ButtonSize, ButtonStyle } from './buttons/Button'
import { useStateValue } from '../../state/useAppState'
import { Text } from '../../util/translate'

type MessageType = 'info' | 'error'

const InfoWrapper = styled.div<{ type: MessageType }>`
  position: absolute;
  bottom: 0;
  right: 2rem;
  z-index: 10;
`

const InfoMessage = styled.div<{ type: MessageType }>`
  padding: 1rem 1rem 1rem 1.5rem;
  border-radius: 0.5rem;
  margin: 0 0 0.75rem 0;
  background: ${(p) => (p.type === 'error' ? 'var(--red)' : 'var(--blue)')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.3;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
`

const DismissButton = styled(Button)`
  border-color: white;
  margin-left: 1rem;
`

type PropTypes = {
  messageType: MessageType
}

const InfoMessages: React.FC<PropTypes> = observer(({ messageType }) => {
  // You'd think Typescript could figure this one out without help
  let stateKey = (messageType === 'info' ? 'infoMessages' : 'errorMessages') as
    | 'infoMessages'
    | 'errorMessages'

  let [messages, { remove: removeMessage }] = useStateValue(stateKey)

  if (messages.length === 0) {
    return null
  }

  return (
    <InfoWrapper type={messageType}>
      {messages.map((message, idx) => (
        <InfoMessage type={messageType} key={`message-${idx}`}>
          <span>{message}</span>
          <DismissButton
            size={ButtonSize.SMALL}
            buttonStyle={messageType === 'error' ? ButtonStyle.REMOVE : ButtonStyle.NORMAL}
            onClick={() => removeMessage(message)}>
            <Text>dismiss</Text>
          </DismissButton>
        </InfoMessage>
      ))}
    </InfoWrapper>
  )
})

export default InfoMessages
