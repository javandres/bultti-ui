import { ActionMap, IAppState, Initializer, StoreContext } from '../type/state'
import { observable } from 'mobx'

export async function createState(
  initializers: Initializer[] = [],
  initialData = {}
): Promise<StoreContext> {
  const state = observable<IAppState>({} as IAppState)
  let actions: Partial<ActionMap> = {}

  for (const initializer of initializers) {
    const createdActions = initializer(state, initialData)
    actions = { ...actions, ...createdActions } as Partial<ActionMap>
  }

  return { state, actions: actions as ActionMap }
}
