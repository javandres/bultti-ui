import * as React from 'react'
import { StoreContext } from '../type/state'

export const StateContext = React.createContext<StoreContext | null>(null)
