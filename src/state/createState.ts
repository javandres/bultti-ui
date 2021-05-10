import { ActionMap, IAppState, Initializer, StoreContext } from '../type/state'
import { observable } from 'mobx'
import { History } from 'history'

export function createState(
  history: History,
  initializers: Initializer[] = [],
  initialData = {}
): StoreContext {
  const state = observable<IAppState>({} as IAppState)
  let actions: Partial<ActionMap> = {}

  for (const initializer of initializers) {
    const createdActions = initializer(state, initialData, history)
    actions = { ...actions, ...createdActions } as Partial<ActionMap>
  }

  return { state, actions: actions as ActionMap }
}
