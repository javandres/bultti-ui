import { useStateValue } from '../state/useAppState'

export function useShowInfoMessage() {
  let [, { add }] = useStateValue('infoMessages')
  return add
}
