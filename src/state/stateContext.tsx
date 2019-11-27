import * as React from 'react'
import { StoreContext } from '../types/state'

export const StateContext = React.createContext<StoreContext | null>(null)
