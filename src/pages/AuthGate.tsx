import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Colors } from '../utils/HSLColors'
import { LoadingDisplay } from '../common/components/Loading'
import { HSLLogoNoText } from '../common/icons/HSLLogoNoText'
import { Login } from '../common/icons/Login'
import { login, redirectToLogin } from '../utils/authentication'
import { useStateValue } from '../state/useAppState'
import { LoginButton } from '../common/components/common'
import { ALLOW_DEV_LOGIN } from '../constants'
import { Text } from '../utils/translate'
import { ButtonSize } from '../common/components/Button'

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

type PropTypes = {
  children?: React.ReactNode
  unauthenticated: boolean
}

const AuthGate: React.FC<PropTypes> = observer(({ unauthenticated = false }) => {
  const [loading, setLoading] = useState(false)
  const [, setUser] = useStateValue('user')

  const openAuthForm = useCallback(() => {
    redirectToLogin()
  }, [])

  const onDevLogin = useCallback(async () => {
    setLoading(true)

    const response = await login('dev')

    if (response && response.isOk && response.email) {
      setUser({ email: response.email })
    }

    setLoading(false)
  }, [])

  return (
    <LoadingScreen>
      <Header>
        {!loading ? (
          <HSLLogoNoText fill="white" height={80} />
        ) : (
          <LoadingIndicator loading={true} size={80} />
        )}
        <Title>
          <Text>general.app.companyName</Text> <Text>general.app.title</Text>
        </Title>
      </Header>
      {unauthenticated && (
        <>
          <ButtonWrapper>
            <LoginButton onClick={openAuthForm} size={ButtonSize.LARGE} transparent>
              <Login height="1em" fill="white" />
              <span className="buttonText">
                <Text>general.app.login</Text>
              </span>
            </LoginButton>
          </ButtonWrapper>
          {ALLOW_DEV_LOGIN && (
            <ButtonWrapper>
              <LoginButton onClick={onDevLogin} size={ButtonSize.LARGE} transparent>
                <Login height="1em" fill="white" />
                <span className="buttonText">Dev login</span>
              </LoginButton>
            </ButtonWrapper>
          )}
        </>
      )}
    </LoadingScreen>
  )
})

export default AuthGate
