import { useContext, useEffect, useMemo } from 'react'
import { authorize, checkExistingSession } from './authentication'
import HistoryContext from './history'
import { useAppState } from '../state/useAppState'
import { AuthResponse } from '../types/authentication'

export const useAuth = () => {
  const history = useContext(HistoryContext)
  const { actions } = useAppState()

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
      } else if (code) {
        const response = await authorize(code, is_test === 'true')

        if (response && response.isOk && response.email) {
          actions.user({ email: response.email })
        } else {
          console.error('Login not successful.')
        }

        const url = new URL(window.location.href)
        url.searchParams.delete('code')
        url.searchParams.delete('scope')

        history.replace({ pathname: '/', search: url.search })
      }
    })()
  }, [code, is_test])
}
