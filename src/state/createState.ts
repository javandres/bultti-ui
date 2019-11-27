import { FunctionMap, IAppState, Initializer, StateContextType } from '../types/state'
import { observable } from 'mobx'

export const createState = async (
  initializers: Initializer[] = [],
  initialData = {}
): Promise<StateContextType> => {
  const state = observable<IAppState>({})
  let actions = {}
  const actionPromises: Array<Promise<FunctionMap>> = []

  for (const [key, initializer] of Object.entries(initializers)) {
    const createdActions = initializer(state, initialData, key)

    if (createdActions && createdActions instanceof Promise) {
      actionPromises.push(createdActions)
    } else {
      actions = { ...actions, ...createdActions }
    }
  }

  if (actionPromises.length !== 0) {
    const resolved = await Promise.all(actionPromises)

    for (const resolvedActions of resolved) {
      actions = { ...actions, ...resolvedActions }
    }
  }

  return { state, actions }
}
