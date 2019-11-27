import { useEffect, useMemo } from 'react'
import { authorize, checkExistingSession } from './authentication'
import { useAppState } from '../state/useAppState'
import { AuthResponse } from '../types/authentication'
import { navigate } from '@reach/router'

export const useAuth = () => {
  const { state, actions } = useAppState()

  const { code, is_test = 'false' }: { code: string; is_test: string } = useMemo(
    () =>
      Array.from(new URL(window.location.href).searchParams.entries()).reduce(
        (params, [key, value]) => {
          params[key] = value
          return params
        },
        { code: '', is_test: 'false' }
      ),
    []
  )

  useEffect(() => {
    ;(async () => {
      const response: AuthResponse = await checkExistingSession()

      if (response && response.isOk && response.email) {
        actions.user({ email: response.email })
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (code) {
        const response = await authorize(code, is_test === 'true')

        if (response && response.isOk && response.email) {
          actions.user({ email: response.email })
        } else {
          console.error('Login not successful.')
        }

        await navigate('/', { replace: true })
      }
    })()
  }, [code, is_test])
}
