import { useContext } from 'react'
import { StateContext } from './stateContext'
import { action } from 'mobx'
import { StoreContext } from '../types/state'

const createDumbAction = (state, stateKey) =>
  action((value) => {
    state[stateKey] = value
  })

export const useStateValue = (valueKey) => {
  const stateContext = useContext(StateContext)

  if (!stateContext) {
    return []
  }

  const value = stateContext.state[valueKey] || null

  const action =
    stateContext.actions[valueKey] || createDumbAction(stateContext?.state, valueKey)

  return [value, action]
}

export const useAppState = (): StoreContext => {
  const currentStateContext = useContext(StateContext)

  if (!currentStateContext) {
    return { state: {}, actions: {} } as StoreContext
  }

  return currentStateContext
}
