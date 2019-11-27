import { useContext, useEffect, useMemo } from 'react'
import { authorize, checkExistingSession } from './authentication'
import HistoryContext from './history'

export const useAuth = () => {
  const history = useContext(HistoryContext)
  const state =

  const { code, is_test = 'false' } = useMemo(
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
      const response = await checkExistingSession()
      response && response.isOk && response.email
        ? UI.setUser(response.email)
        : UI.setUser(null)

      if (code) {
        const response = await authorize(code, is_test === 'true')

        if (response && response.isOk && response.email) {
          UI.setUser(response.email)
        } else {
          console.error('Login not successful.')
        }

        let currentUrl = window.location.href
        const url = new URL(currentUrl)
        url.searchParams.delete('code')
        url.searchParams.delete('scope')

        history.replace({ pathname: '/', search: url.search })
      }
    })()
  }, [code, is_test])
}
