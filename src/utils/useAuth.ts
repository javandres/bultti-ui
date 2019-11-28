import { useMemo } from 'react'
import { authorize, checkExistingSession } from './authentication'
import { useStateValue } from '../state/useAppState'
import { AuthResponse } from '../types/authentication'
import { navigate } from '@reach/router'
import { useAsyncEffect } from './useAsyncEffect'

export const useAuth = () => {
  const [, setUser] = useStateValue('user')

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

  useAsyncEffect(async () => {
    const response: AuthResponse = await checkExistingSession()

    if (response && response.isOk && response.email) {
      setUser({ email: response.email })
    }
  }, [])

  useAsyncEffect(async () => {
    if (code) {
      const response = await authorize(code, is_test === 'true')

      if (response && response.isOk && response.email) {
        setUser({ email: response.email })
      } else {
        console.error('Login not successful.')
      }

      await navigate('/', { replace: true })
    }
  }, [code])
}
