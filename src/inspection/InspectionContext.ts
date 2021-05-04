import React from 'react'
import { Inspection } from './inspectionTypes'

export const InspectionContext = React.createContext<Inspection | null>(null)
