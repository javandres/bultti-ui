import { useContext } from 'react'
import { StateContext } from './stateContext'
import { ActionMap, IAppState, StoreContext } from '../type/state'

export function useStateValue<
  ValueKeyType extends keyof IAppState,
  ActionKeyType extends keyof ActionMap = ValueKeyType
>(
  valueKey: ValueKeyType,
  actionName: ActionKeyType = (valueKey as unknown) as ActionKeyType
): [IAppState[typeof valueKey], ActionMap[typeof actionName]] {
  const stateContext = useAppState()

  let actionKey = ((actionName || valueKey) as unknown) as keyof ActionMap
  let action = stateContext?.actions[actionKey] || (() => {})

  return [stateContext?.state[valueKey], action as ActionMap[typeof actionName]]
}

export const useAppState = (): StoreContext => {
  const currentStateContext = useContext(StateContext)

  if (!currentStateContext) {
    return { state: {}, actions: {} } as StoreContext
  }

  return currentStateContext
}
