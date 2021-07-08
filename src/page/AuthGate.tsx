import React from 'react'
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
import { UserIcon } from '../common/icon/UserIcon'

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
  display: flex;
  flex-direction: column;
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
  buttonStyle: ButtonStyle.NORMAL,
  size: ButtonSize.LARGE,
}))`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  user-select: none;
  cursor: pointer;
  margin-bottom: 1rem;

  svg + .buttonText {
    margin-left: 1rem;
  }
`
// For some reason I can't extend from LoginButton, it results in an error.
const RegisterButton = styled(StyledButton).attrs(() => ({
  inverted: true,
  buttonStyle: ButtonStyle.SECONDARY,
  size: ButtonSize.LARGE,
}))`
  display: flex;
  justify-content: space-between;
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

const redirectToAuth = (register = false): void => {
  let currentPath = window.location.href.replace(window.location.origin, '')

  if (currentPath && currentPath.length > 1) {
    sessionStorage.setItem('return_to_url', currentPath)
  }

  let authUrl = `${AUTH_URI}?ns=hsl-transitlog&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${AUTH_SCOPE}&ui_locales=en`

  if (register) {
    authUrl += '&nur'
  }

  window.location.assign(authUrl)
}

const AuthGate: React.FC<PropTypes> = observer(({ loading, unauthenticated = false }) => {
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
            <LoginButton onClick={() => redirectToAuth(false)}>
              <Login height="1em" fill="var(--blue)" />
              <span className="buttonText">
                <Text>login</Text>
              </span>
            </LoginButton>
            <RegisterButton onClick={() => redirectToAuth(true)}>
              <UserIcon height="1em" fill="white" />
              <span className="buttonText">
                <Text>register</Text>
              </span>
            </RegisterButton>
          </ButtonWrapper>
        </>
      )}
      <InfoMessages />
    </LoadingScreen>
  )
})

export default AuthGate
