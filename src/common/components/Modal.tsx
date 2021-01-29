import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'

const ModalOverlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalView = styled.div`
  flex: 1 1 auto;
  padding-left: 28rem;
  padding-right: 2rem;
`

export type PropTypes = {
  children?: React.ReactNode
}

const Modal: React.FC<PropTypes> = observer(({ children }) => {
  return (
    <ModalOverlay>
      <ModalView>{children}</ModalView>
    </ModalOverlay>
  )
})

export default Modal
