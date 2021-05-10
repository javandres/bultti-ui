import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components/macro'
import { Colors } from '../util/HSLColors'
import { LoadingDisplay } from '../common/components/Loading'
import { HSLLogoNoText } from '../common/icon/HSLLogoNoText'
import { Login } from '../common/icon/Login'
import { Text } from '../util/translate'
import { ButtonSize, ButtonStyle, StyledButton } from '../common/components/buttons/Button'
import { AUTH_SCOPE, AUTH_URI, CLIENT_ID, REDIRECT_URI } from '../constants'
import InfoMessages from '../common/components/InfoMessages'
import { useLocation } from 'react-router-dom'

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

const ButtonWrapper = styled.div`
  margin-bottom: 1rem;
`

const LoadingIndicator = styled(LoadingDisplay)`
  position: static;
`

const Header = styled.div`
  margin-bottom: 2.5rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled.h2`
  color: white;
  font-size: 5rem;
  margin: 1rem 0 0;
  text-align: center;
`

const LoginButton = styled(StyledButton).attrs(() => ({
  inverted: true,
  buttonStyle: ButtonStyle.SECONDARY,
  size: ButtonSize.LARGE,
}))`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  user-select: none;
  cursor: pointer;

  svg + .buttonText {
    margin-left: 1rem;
  }
`

type PropTypes = {
  children?: React.ReactNode
  unauthenticated: boolean
  loading: boolean
}

const redirectToLogin = () => {
  let authUrl = `${AUTH_URI}?ns=hsl-transitlog&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${AUTH_SCOPE}&ui_locales=en`
  window.location.assign(authUrl)
}

const AuthGate: React.FC<PropTypes> = observer(({ loading, unauthenticated = false }) => {
  let location = useLocation()

  const openAuthForm = useCallback(() => {
    let currentPath = location.pathname
    sessionStorage.setItem('return_to_url', currentPath)

    redirectToLogin()
  }, [location])

  return (
    <LoadingScreen>
      <Header>
        {!loading ? (
          <HSLLogoNoText fill="white" height={80} />
        ) : (
          <LoadingIndicator loading={true} size={80} />
        )}
        <Title>
          <Text>appName</Text>
        </Title>
      </Header>
      {unauthenticated && (
        <>
          <ButtonWrapper>
            <LoginButton onClick={openAuthForm}>
              <Login height="1em" fill="white" />
              <span className="buttonText">
                <Text>login</Text>
              </span>
            </LoginButton>
          </ButtonWrapper>
        </>
      )}
      <InfoMessages />
    </LoadingScreen>
  )
})

export default AuthGate
