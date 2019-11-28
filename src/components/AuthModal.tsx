import React, { useCallback } from 'react'
import HSLLogoNoText from '../icons/HSLLogoNoText'
import Login from '../icons/Login'
import { logout } from '../utils/authentication'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useStateValue } from '../state/useAppState'
import { LoginButton } from './common'

const Root = styled.div`
  position: fixed;
  z-index: 800;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`

const Wrapper = styled.div`
  position: fixed;
  z-index: 900;
  top: 50%;
  left: 50%;
  padding: 30px 90px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 3px 14px rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  text-align: center;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background-color: #007ac9a6;
`

const Header = styled.div`
  padding: 10px 0px 10px 0px;
  user-select: none;
`

const LoginText = styled.span`
  margin-left: 10px;
`

const Title = styled.h2`
  margin: 10px 0px 10px 0px;
`

const AuthModal: React.FC = observer((props) => {
  const [, setUser] = useStateValue('user')

  const onLogoutClick = useCallback(() => {
    logout().then(async (success) => {
      if (success) {
        setUser(null)
      }
    })
  }, [])

  return (
    <Root>
      <Wrapper>
        <Header>
          <HSLLogoNoText fill={'white'} height={'80px'} />
          <Title>HSL Bultti</Title>
        </Header>
        <LoginButton data-testid="logout-button" onClick={onLogoutClick}>
          <Login height={'1em'} fill={'#3e3e3e'} />
          <LoginText>Kirjaudu ulos</LoginText>
        </LoginButton>
      </Wrapper>
    </Root>
  )
})

export default AuthModal
