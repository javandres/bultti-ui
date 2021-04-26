import { useStateValue } from '../state/useAppState'
import { useCallback } from 'react'
import { MessageActions } from '../type/state'

export function useShowInfoMessage() {
  let [, { add }]: [string, MessageActions] = useStateValue('infoMessages')

  return useCallback(
    (message) => {
      add(message)
    },
    [add]
  )
}
