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
import { text } from './translate'
import { useShowErrorNotification } from './useShowNotification'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

export const useAuth = (): [AuthState, boolean] => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED)
  const [currentUser, setCurrentUser] = useStateValue('user')
  let showErrorMessage = useShowErrorNotification()

  // To prevent unwanted navigation, only set this to true when the app should
  // navigate away from the login screen.
  let shouldNavigate = useRef(false)

  const [login, { loading: isLoginLoading }] = useMutationData<User>(loginMutation)

  const {
    data: fetchedUser,
    refetch: refetchUserCb,
    loading: isCurrentUserLoading,
  } = useQueryData<User>(currentUserQuery)

  let refetchUser = useRefetch(refetchUserCb)

  let navigateNext = useCallback(() => {
    if (shouldNavigate.current) {
      shouldNavigate.current = false
      let nextUrl = sessionStorage.getItem('return_to_url') || '/'
      sessionStorage.removeItem('return_to_url')
      navigate(nextUrl, { replace: true })
    }
  }, [navigate, shouldNavigate.current])

  useEffect(() => {
    if (currentUser || isCurrentUserLoading) {
      return
    }
    if (fetchedUser) {
      setCurrentUser(fetchedUser)
    }
  }, [fetchedUser, isCurrentUserLoading, currentUser])

  useEffect(() => {
    if (getAuthToken() && !currentUser && !fetchedUser && !isCurrentUserLoading) {
      refetchUser()
    }
  }, [fetchedUser, refetchUser, currentUser])

  const {
    codeUrlParam,
    isTestUrlParam = false,
    roleUrlParam,
  }: {
    codeUrlParam: string
    isTestUrlParam: boolean
    roleUrlParam: string
  } = useMemo(
    () => ({
      codeUrlParam: (getUrlValue('code', '') || '') as string,
      isTestUrlParam: (getUrlValue('isTest', false) || false) as boolean,
      roleUrlParam: (getUrlValue('role', '') || '') as string,
    }),
    [authState] // Re-evaluate after authState changes
  )

  useEffect(() => {
    let currentAuthToken = getAuthToken()
    if (!codeUrlParam && currentAuthToken) {
      if (currentUser && authState === AuthState.AUTHENTICATED) {
        navigateNext()
        return
      }

      if (currentUser && authState === AuthState.UNAUTHENTICATED) {
        setAuthState(AuthState.AUTHENTICATED)
        return
      }
    }

    if (
      !codeUrlParam &&
      (!currentAuthToken || (!currentUser && authState === AuthState.AUTHENTICATED))
    ) {
      setAuthState(AuthState.UNAUTHENTICATED)
      return
    }

    if (codeUrlParam && authState === AuthState.UNAUTHENTICATED) {
      setAuthState(AuthState.PENDING)
      setUrlValue('code', null)
      setUrlValue('isTest', null)
      setUrlValue('role', null)
      login({
        variables: {
          authorizationCode: codeUrlParam,
          isTest: isTestUrlParam,
          role: roleUrlParam,
        },
      }).then(({ data }) => {
        let token = pickGraphqlData(data)
        if (token) {
          saveAuthToken(token)
          setAuthState(AuthState.AUTHENTICATED)

          shouldNavigate.current = true
          refetchUser()
        } else {
          setAuthState(AuthState.UNAUTHENTICATED)
          showErrorMessage(text('login_failed'))
        }
      })
    }
  }, [currentUser, codeUrlParam, authState, login, refetchUser, navigateNext])

  return [authState, isLoginLoading]
}
