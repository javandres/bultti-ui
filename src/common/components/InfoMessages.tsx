import React from 'react'
import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components/macro'
import { Button, ButtonSize, ButtonStyle } from './buttons/Button'
import { useStateValue } from '../../state/useAppState'
import { Text } from '../../util/translate'

type MessageType = 'info' | 'error'

const InfoWrapper = styled.div<{ type: MessageType }>`
  ${(p) =>
    p.type === 'error'
      ? css`
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 10;
        `
      : css`
          // TODO
        `}
`

const InfoMessage = styled.div<{ type: MessageType }>`
  padding: 0.33rem 1rem;
  background: ${(p) => (p.type === 'error' ? 'var(--red)' : 'var(--blue)')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  line-height: 1;
  border-top: 1px solid ${(p) => (p.type === 'error' ? '#a72828' : 'var(--light-blue)')}; ;
`

const DismissButton = styled(Button)`
  border-color: white;
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
