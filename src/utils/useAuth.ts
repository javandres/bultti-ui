import { useEffect, useMemo, useState } from 'react'
import { useStateValue } from '../state/useAppState'
import { navigate } from '@reach/router'
import { useMutationData } from './useMutationData'
import { currentUserQuery, loginMutation } from '../common/queries/authQueries'
import { User } from '../schema-types'
import { useLazyQueryData } from './useLazyQueryData'
import { pickGraphqlData } from './pickGraphqlData'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
  UNKNOWN,
}

export const useAuth = (): [AuthState, boolean] => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNKNOWN)
  const [user, setUser] = useStateValue('user')

  const [login, { loading: loginLoading }] = useMutationData<User>(loginMutation)

  const [fetchCurrentUser, { data: fetchedCurrentUser, loading: userLoading }] = useLazyQueryData<
    User
  >(currentUserQuery)

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
    if (fetchedCurrentUser) {
      setUser(fetchedCurrentUser)
      setAuthState(AuthState.AUTHENTICATED)
    } else if (authState === AuthState.PENDING) {
      setAuthState(AuthState.UNAUTHENTICATED)
    }
  }, [fetchedCurrentUser])

  useEffect(() => {
    if (code && ![AuthState.PENDING, AuthState.AUTHENTICATED].includes(authState)) {
      setAuthState(AuthState.PENDING)
      login({
        variables: {
          authorizationCode: code,
          isTest: is_test === 'true',
        },
      }).then(({ data }) => {
        const authenticatedUser = pickGraphqlData(data)

        if (authenticatedUser) {
          setUser(authenticatedUser)
          setAuthState(AuthState.AUTHENTICATED)
        } else {
          console.error('Login not successful.')
          setAuthState(AuthState.UNAUTHENTICATED)
        }

        navigate('/', { replace: true })
      })
    } else if (!fetchedCurrentUser && authState === AuthState.UNKNOWN) {
      setAuthState(AuthState.PENDING)
      fetchCurrentUser() // Start the fetch, the data is handled in the effect above.
    } else if (user && authState !== AuthState.AUTHENTICATED) {
      setAuthState(AuthState.AUTHENTICATED)
    } else if (!user && authState === AuthState.AUTHENTICATED) {
      setAuthState(AuthState.UNAUTHENTICATED)
    }
  }, [code, authState, user])

  return [authState, loginLoading || userLoading]
}
