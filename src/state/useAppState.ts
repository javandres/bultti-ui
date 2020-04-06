import { useContext } from 'react'
import { StateContext } from './stateContext'
import { action } from 'mobx'
import { StoreContext } from '../type/state'
import { useObserver } from 'mobx-react-lite'

const createDefaultAction = (state, stateKey) =>
  action((value) => {
    state[stateKey] = value
  })

export const useStateValue = <T = any>(valueKey): [T, (...args: any[]) => any] => {
  const stateContext = useContext(StateContext)
  const value = useObserver(() => stateContext?.state[valueKey] || null)

  if (!stateContext) {
    return [value, () => {}]
  }

  const action = stateContext.actions[valueKey] || createDefaultAction(stateContext.state, valueKey)
  return [value, action]
}

export const useAppState = (): StoreContext => {
  const currentStateContext = useContext(StateContext)

  if (!currentStateContext) {
    return { state: {}, actions: {} } as StoreContext
  }

  return currentStateContext
}
