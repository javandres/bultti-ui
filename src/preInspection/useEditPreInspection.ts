import { useNavigate } from '@reach/router'
import { useCallback } from 'react'

export function useEditPreInspection(preInspectionId = '') {
  let navigate = useNavigate()

  return useCallback(
    (altPreInspectionId = '') => {
      let useId = preInspectionId || altPreInspectionId || ''

      if (!useId) {
        navigate(`/pre-inspection/edit`, { replace: true })
      } else {
        navigate(`/pre-inspection/edit/${useId}`)
      }
    },
    [preInspectionId, navigate]
  )
}
