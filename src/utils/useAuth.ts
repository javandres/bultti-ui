import { useEffect, useMemo, useState } from 'react'
import { useStateValue } from '../state/useAppState'
import { useMutationData } from './useMutationData'
import { currentUserQuery, loginMutation } from '../common/queries/authQueries'
import { User } from '../schema-types'
import { navigate } from '@reach/router'
import { useQueryData } from './useQueryData'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

export const useAuth = (): [AuthState, boolean] => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED)
  const [user, setUser] = useStateValue('user')

  const [login, { data: loginUser, loading: loginLoading }] = useMutationData<User>(loginMutation)
  const { data: currentUser, loading: userLoading } = useQueryData<User>(currentUserQuery)

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

  const authLoading = useMemo(() => loginLoading || userLoading, [loginLoading, userLoading])

  useEffect(() => {
    if (!user && currentUser && authState !== AuthState.AUTHENTICATED) {
      setUser(currentUser)
      setAuthState(AuthState.AUTHENTICATED)
      return
    }

    if (user || authState !== AuthState.PENDING) {
      return
    }

    if (loginUser) {
      setUser(loginUser)
      setAuthState(AuthState.AUTHENTICATED)
      navigate('/', { replace: true })
    } else if (!authLoading) {
      console.error('Login not successful.')
      setAuthState(AuthState.UNAUTHENTICATED)
    }
  }, [user, loginUser, authState, currentUser])

  useEffect(() => {
    if (authState === AuthState.PENDING) {
      return
    }

    if (code && authState === AuthState.UNAUTHENTICATED) {
      setAuthState(AuthState.PENDING)
      login({
        variables: {
          authorizationCode: code,
          isTest: is_test === 'true',
        },
      })
    } else if (user && authState === AuthState.UNAUTHENTICATED) {
      setAuthState(AuthState.AUTHENTICATED)
    } else if (!user && authState === AuthState.AUTHENTICATED) {
      setAuthState(AuthState.UNAUTHENTICATED)
    }
  }, [code, authState, user, login])

  return [authState, authLoading]
}
