import { useCallback } from 'react'
import { InitialPreInspectionInput, PreInspection } from '../schema-types'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { useMutationData } from '../util/useMutationData'
import { createPreInspectionMutation, removePreInspectionMutation } from './preInspectionQueries'
import { useNavigate } from '@reach/router'

export function useCreatePreInspection(operator, season) {
  let [createPreInspection, { loading: createLoading }] = useMutationData(
    createPreInspectionMutation
  )

  // Initialize the form by creating a pre-inspection on the server and getting the ID.
  return useCallback(async () => {
    // A pre-inspection can be created when there is not one currently existing or loading
    if (operator && season && !createLoading) {
      // InitialPreInspectionInput requires operator and season ID.
      let preInspectionInput: InitialPreInspectionInput = {
        operatorId: operator.id,
        seasonId: season.id,
        startDate: season.startDate,
        endDate: season.endDate,
      }

      let createResult = await createPreInspection({
        variables: {
          preInspectionInput,
        },
      })

      let newPreInspection = pickGraphqlData(createResult.data)

      if (newPreInspection) {
        return newPreInspection
      } else {
        console.error(createResult.errors)
      }

      return null
    }
  }, [season, operator, createLoading])
}

export function useRemovePreInspection(
  afterRemove: () => unknown = () => {}
): [(PreInspection?: PreInspection) => Promise<unknown>, { loading: boolean }] {
  let [removePreInspection, { loading }] = useMutationData(removePreInspectionMutation)

  let execRemove = useCallback(
    async (preInspection?: PreInspection) => {
      if (preInspection) {
        await removePreInspection({
          variables: {
            preInspectionId: preInspection.id,
          },
        })

        await afterRemove()
      }
    },
    [removePreInspection, afterRemove]
  )

  return [execRemove, { loading }]
}

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
