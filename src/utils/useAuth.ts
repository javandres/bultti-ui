import { useMemo, useState } from 'react'
import { checkExistingSession, login } from './authentication'
import { useStateValue } from '../state/useAppState'
import { navigate } from '@reach/router'
import { useAsyncEffect } from './useAsyncEffect'
import { AuthResponse } from '../types/authentication'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
  UNKNOWN,
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNKNOWN)
  const [user, setUser] = useStateValue('user')

  const { code, is_test = 'false' }: { code: string; is_test: string } = useMemo(
    () =>
      Array.from(new URL(window.location.href).searchParams.entries()).reduce(
        (params, [key, value]) => {
          params[key] = value
          return params
        },
        { code: '', is_test: 'false' }
      ),
    [authState]
  )

  useAsyncEffect(async () => {
    if (code && (authState === AuthState.UNKNOWN || authState === AuthState.UNAUTHENTICATED)) {
      setAuthState(AuthState.PENDING)
      const response = await login(code, is_test === 'true')

      if (response && response.isOk && response.email) {
        setAuthState(AuthState.AUTHENTICATED)
        setUser({ email: response.email })
      } else {
        console.error('Login not successful.')
        setAuthState(AuthState.UNAUTHENTICATED)
      }

      await navigate('/', { replace: true })
    } else if (authState === AuthState.UNKNOWN) {
      setAuthState(AuthState.PENDING)
      const response: AuthResponse = await checkExistingSession()

      if (response && response.isOk && response.email) {
        setAuthState(AuthState.AUTHENTICATED)
        setUser({ email: response.email })
      } else {
        setAuthState(AuthState.UNAUTHENTICATED)
      }
    } else if (user && authState !== AuthState.AUTHENTICATED) {
      setAuthState(AuthState.AUTHENTICATED)
    } else if (!user && authState === AuthState.AUTHENTICATED) {
      setAuthState(AuthState.UNAUTHENTICATED)
    }
  }, [code, authState, user])

  return authState
}
