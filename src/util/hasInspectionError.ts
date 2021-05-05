import { Inspection, InspectionValidationError } from '../schema-types'
import { useMemo } from 'react'

export function hasInspectionError(inspection: Inspection, error?: InspectionValidationError) {
  let inspectionErrors = inspection?.inspectionErrors || []

  if (!error) {
    return inspectionErrors.length !== 0
  }

  return inspectionErrors.some((err) => err.type === error)
}

export function useHasInspectionError(
  inspection?: Inspection | null,
  error?: InspectionValidationError
) {
  return useMemo(() => {
    if (!inspection) {
      return false
    }

    return hasInspectionError(inspection, error)
  }, [inspection])
}
