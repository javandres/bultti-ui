import { useCallback, useEffect, useState } from 'react'

export const useRefetch = (refetcher: () => unknown, initState = false) => {
  let [shouldRefetch, setShouldRefetch] = useState(initState)
  let queueRefetch = useCallback(() => setShouldRefetch(true), [])

  useEffect(() => {
    if (shouldRefetch && refetcher) {
      setShouldRefetch(false)
      refetcher()
    }
  }, [shouldRefetch, refetcher])

  return queueRefetch
}
