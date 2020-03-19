import { useEffect } from 'react'

const noop = () => {}

export const useAsyncEffect = (
  effect: () => Promise<void>,
  depsOrCleanup: (() => void) | any[],
  deps?: any[]
) => {
  const cleanupFn = typeof depsOrCleanup === 'function' ? depsOrCleanup : noop
  const depsArr = Array.isArray(depsOrCleanup)
    ? depsOrCleanup
    : typeof deps !== 'undefined'
    ? deps
    : undefined

  useEffect(() => {
    effect().then()
    return cleanupFn
  }, depsArr)
}
