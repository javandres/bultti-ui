import React from 'react'
import { Inspection } from '../schema-types'

export const PreInspectionContext = React.createContext<Inspection | null>(null)
