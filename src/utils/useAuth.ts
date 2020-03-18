import { useEffect, useMemo, useState } from 'react'
import { useStateValue } from '../state/useAppState'
import { useMutationData } from './useMutationData'
import { currentUserQuery, loginMutation } from '../common/queries/authQueries'
import { User } from '../schema-types'
import { navigate } from '@reach/router'
import { useLazyQueryData } from './useLazyQueryData'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

export const useAuth = (): [AuthState, boolean] => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED)
  const [user, setUser] = useStateValue('user')

  const [login, { loading: loginLoading }] = useMutationData<User>(loginMutation)
  const [fetchUser, { data: currentUser }] = useLazyQueryData<User>(currentUserQuery)

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
      setAuthState(AuthState.AUTHENTICATED)
    } else if (authState === AuthState.AUTHENTICATED) {
      setUser(null)
      setAuthState(AuthState.UNAUTHENTICATED)
    }
  }, [currentUser, setUser])

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

  useEffect(() => {
    if (user && authState === AuthState.AUTHENTICATED) {
      console.log('User is authenticated')
      return
    }

    if (user && authState === AuthState.UNAUTHENTICATED) {
      console.log('User found, state set to authenticated')
      setAuthState(AuthState.AUTHENTICATED)
      return
    } else if (!user && authState === AuthState.AUTHENTICATED) {
      console.log('No user, state set to unauthenticated')
      setAuthState(AuthState.UNAUTHENTICATED)
      return
    }

    if (code && authState === AuthState.UNAUTHENTICATED) {
      setAuthState(AuthState.PENDING)
      console.log('Code found, logging in.')

      login({
        variables: {
          authorizationCode: code,
          isTest: is_test === 'true',
        },
      }).then(() => {
        fetchUser()
        return navigate('/', { replace: true })
      })
    }
  }, [user, code, authState, login])

  return [authState, loginLoading]
}
