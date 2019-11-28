import React from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Colors } from '../utils/HSLColors'
import { LoadingDisplay } from '../components/Loading'
import AuthModal from '../components/AuthModal'

const LoadingScreen = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: ${Colors.primary.hslBlue};
`

const TextContent = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  color: white;
  font-size: 4rem;
`

const LoadingIndicator = styled(LoadingDisplay)`
  position: static;
`

type PropTypes = {
  children?: React.ReactNode
  showAuthModal: boolean
}

const AppLoading: React.FC<PropTypes> = observer(({ showAuthModal = false }) => {
  return (
    <LoadingScreen>
      <TextContent>HSL Bultti</TextContent>
      <LoadingIndicator loading={true} size={60} />
      {showAuthModal && <AuthModal />}
    </LoadingScreen>
  )
})

export default AppLoading
