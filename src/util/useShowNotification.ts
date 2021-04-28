import { useStateValue } from '../state/useAppState'
import { useCallback } from 'react'
import { UINotification } from '../type/state'

export function useShowNotification(type: UINotification['type']) {
  let [, { add }] = useStateValue('notifications')
  return useCallback((message: string) => add({ message, type }), [add])
}

export function useShowInfoNotification() {
  return useShowNotification('info')
}

export function useShowErrorNotification() {
  return useShowNotification('error')
}
