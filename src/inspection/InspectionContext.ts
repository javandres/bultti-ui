import React from 'react'
import { Inspection } from '../schema-types'

export const InspectionContext = React.createContext<Inspection | null>(null)
