import { useEffect, useMemo, useState } from 'react'
import { useStateValue } from '../state/useAppState'
import { useMutationData } from './useMutationData'
import { currentUserQuery, loginMutation } from '../common/query/authQueries'
import { User } from '../schema-types'
import { useLazyQueryData } from './useLazyQueryData'
import { pickGraphqlData } from './pickGraphqlData'
import { getUrlValue, navigate, setUrlValue } from './urlValue'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

export const useAuth = (): [AuthState, boolean] => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED)
  const [user, setUser] = useStateValue('user')

  const [login, { loading: loginLoading }] = useMutationData<User>(loginMutation)
  const [fetchUser, { data: currentUser, loading: currentUserLoading }] = useLazyQueryData<
    User
  >(currentUserQuery)

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
      setAuthState(AuthState.AUTHENTICATED)
    } else if (authState === AuthState.UNAUTHENTICATED) {
      fetchUser()
    }
  }, [currentUser, fetchUser, setUser, currentUserLoading])

  const { code, is_test = false }: { code: string; is_test: boolean } = useMemo(
    () => ({
      code: (getUrlValue('code', '') || '') as string,
      is_test: (getUrlValue('is_test', false) || false) as boolean,
    }),
    [authState] // Re-evaluate after authState changes
  )

  useEffect(() => {
    if (user && authState === AuthState.AUTHENTICATED) {
      return
    }

    if (user && authState === AuthState.UNAUTHENTICATED) {
      setAuthState(AuthState.AUTHENTICATED)
      return
    } else if (!user && authState === AuthState.AUTHENTICATED) {
      setAuthState(AuthState.UNAUTHENTICATED)
      return
    }

    if (code && authState === AuthState.UNAUTHENTICATED) {
      setAuthState(AuthState.PENDING)
      setUrlValue('code', null)
      setUrlValue('is_test', null)

      login({
        variables: {
          authorizationCode: code + '',
          isTest: is_test,
        },
      }).then(({ data }) => {
        const user = pickGraphqlData(data)

        if (user) {
          setUser(user)
          setAuthState(AuthState.AUTHENTICATED)
        } else {
          setAuthState(AuthState.UNAUTHENTICATED)
        }

        let nextUrl = sessionStorage.getItem('return_to_url') || '/'
        sessionStorage.removeItem('return_to_url')
        navigate(nextUrl, { replace: true })
      })
    }
  }, [user, code, authState, login])

  return [authState, loginLoading]
}
