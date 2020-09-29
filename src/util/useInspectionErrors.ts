import { ValidationErrorData } from '../schema-types'
import { useCallback, useMemo } from 'react'
import { groupBy } from 'lodash'

export function useInspectionErrors(errors: ValidationErrorData[]) {
  let errorsByObject = useMemo(() => groupBy(errors, 'objectId'), [errors])

  let getByObjectId = useCallback(
    (objectId): ValidationErrorData[] => {
      return errorsByObject[objectId] || []
    },
    [errorsByObject]
  )

  return {
    getByObjectId,
  }
}
