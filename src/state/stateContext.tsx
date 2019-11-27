import * as React from 'react'
import { StateContextType } from '../types/state'

export const StateContext = React.createContext<StateContextType | null>(null)
