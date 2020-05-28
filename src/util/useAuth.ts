import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStateValue } from '../state/useAppState'
import { useMutationData } from './useMutationData'
import { currentUserQuery, loginMutation } from '../common/query/authQueries'
import { User } from '../schema-types'
import { getUrlValue, navigate, setUrlValue } from './urlValue'
import { useQueryData } from './useQueryData'
import { useRefetch } from './useRefetch'
import { getAuthToken, saveAuthToken } from './authToken'
import { pickGraphqlData } from './pickGraphqlData'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

export const useAuth = (): [AuthState, boolean] => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED)
  const [user, setUser] = useStateValue('user')
  // To prevent unwanted navigation, only set this to true when the app should
  // navigate away from the login screen.
  let shouldNavigate = useRef(false)

  const [login, { loading: loginLoading }] = useMutationData<User>(loginMutation)
  const { data: fetchedUser, refetch, loading: currentUserLoading } = useQueryData<User>(
    currentUserQuery
  )

  let fetchUser = useRefetch(refetch)

  let navigateNext = useCallback(() => {
    if (shouldNavigate.current) {
      shouldNavigate.current = false
      let nextUrl = sessionStorage.getItem('return_to_url') || '/'
      sessionStorage.removeItem('return_to_url')
      navigate(nextUrl, { replace: true })
    }
  }, [navigate, shouldNavigate.current])

  useEffect(() => {
    if (fetchedUser && !user) {
      setUser(fetchedUser)
    }
  }, [fetchedUser, user])

  useEffect(() => {
    if (getAuthToken() && !user && !fetchedUser && !currentUserLoading) {
      fetchUser()
    }
  }, [fetchedUser, fetchUser, user])

  const { code, is_test = false }: { code: string; is_test: boolean } = useMemo(
    () => ({
      code: (getUrlValue('code', '') || '') as string,
      is_test: (getUrlValue('is_test', false) || false) as boolean,
    }),
    [authState] // Re-evaluate after authState changes
  )

  useEffect(() => {
    let currentAuthToken = getAuthToken()

    if (!code && currentAuthToken) {
      if (user && authState === AuthState.AUTHENTICATED) {
        navigateNext()
        return
      }

      if (user && authState === AuthState.UNAUTHENTICATED) {
        setAuthState(AuthState.AUTHENTICATED)
        return
      }
    }

    if (!code && (!currentAuthToken || (!user && authState === AuthState.AUTHENTICATED))) {
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
        let token = pickGraphqlData(data)

        if (token) {
          saveAuthToken(token)
          setAuthState(AuthState.AUTHENTICATED)

          shouldNavigate.current = true
          fetchUser()
        } else {
          setAuthState(AuthState.UNAUTHENTICATED)
        }
      })
    }
  }, [user, code, authState, login, fetchUser, navigateNext])

  return [authState, loginLoading]
}
