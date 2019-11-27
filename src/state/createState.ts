import { ActionMap, IAppState, Initializer, StoreContext } from '../types/state'
import { observable } from 'mobx'

export const createState = async (
  initializers: Initializer[] = [],
  initialData = {}
): Promise<StoreContext> => {
  const state = observable<IAppState>({})
  let actions: any = {}
  const actionPromises: Array<Promise<ActionMap>> = []

  for (const initializer of initializers) {
    const createdActions = initializer(state, initialData)

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
