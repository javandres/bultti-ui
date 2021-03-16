import React, { useEffect } from 'react'
import { useStateValue } from '../state/useAppState'

const DEFAULT_MESSAGE =
  'Sinulla on tallentamattomia muutoksia. Haluatko varmasti poistua näkymästä? Tallentamattomat muutokset kumotaan'

export const usePromptUnsavedChanges = ({
  shouldShowPrompt,
  uniqueComponentId,
}: {
  shouldShowPrompt: boolean
  uniqueComponentId: string
}) => {
  let [unsavedFormIds, setUnsavedFormIds] = useStateValue('unsavedFormIds')

  useEffect(() => {
    let nextUnsavedIds = [...unsavedFormIds]

    if (shouldShowPrompt) {
      nextUnsavedIds.push(uniqueComponentId)
    } else {
      nextUnsavedIds = nextUnsavedIds.filter((id) => id !== uniqueComponentId)
    }
    setUnsavedFormIds(nextUnsavedIds)

    return () => {
      nextUnsavedIds = nextUnsavedIds.filter((id) => id !== uniqueComponentId)
      setUnsavedFormIds(nextUnsavedIds)
    }
  }, [shouldShowPrompt])
}

export const promptUnsavedChangesOnClickEvent = (unsavedFormIdsState) => (
  clickEvent: React.MouseEvent
) => {
  let [unsavedFormIds, setUnsavedFormIds] = unsavedFormIdsState
  if (unsavedFormIds.length > 0) {
    if (window.confirm(DEFAULT_MESSAGE)) {
      setUnsavedFormIds([])
    } else {
      clickEvent.preventDefault()
    }
  }
}
