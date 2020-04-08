import { useEffect, useMemo, useState } from 'react'
import { useStateValue } from '../state/useAppState'
import { useMutationData } from './useMutationData'
import { currentUserQuery, loginMutation } from '../common/query/authQueries'
import { User } from '../schema-types'
import { useLocation, useNavigate } from '@reach/router'
import { useLazyQueryData } from './useLazyQueryData'
import { pickGraphqlData } from './pickGraphqlData'

export enum AuthState {
  AUTHENTICATED,
  UNAUTHENTICATED,
  PENDING,
}

export const useAuth = (): [AuthState, boolean] => {
  let location = useLocation()
  let navigate = useNavigate()

  const [authState, setAuthState] = useState<AuthState>(AuthState.UNAUTHENTICATED)
  const [user, setUser] = useStateValue('user')

  const [login, { loading: loginLoading }] = useMutationData<User>(loginMutation)
  const [fetchUser, { data: currentUser, loading: currentUserLoading }] = useLazyQueryData<User>(
    currentUserQuery
  )

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
      setAuthState(AuthState.AUTHENTICATED)
    } else if (authState === AuthState.UNAUTHENTICATED) {
      fetchUser()
    }
  }, [currentUser, fetchUser, setUser, currentUserLoading])

  const { code, is_test = 'false' }: { code: string; is_test: string } = useMemo(
    () =>
      Array.from(new URL(location.href).searchParams.entries()).reduce(
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

      login({
        variables: {
          authorizationCode: code,
          isTest: is_test === 'true',
        },
      }).then(({ data }) => {
        const user = pickGraphqlData(data)

        if (user) {
          setUser(user)
          setAuthState(AuthState.AUTHENTICATED)
        } else {
          setAuthState(AuthState.UNAUTHENTICATED)
        }

        return navigate('/', { replace: true })
      })
    }
  }, [user, code, authState, login])

  return [authState, loginLoading]
}
