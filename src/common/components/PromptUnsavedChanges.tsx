import React from 'react'
import { useEffect } from 'react'
import { useStateValue } from '../../state/useAppState'

export type PropTypes = {
  uniqueComponentId: string
  shouldShowPrompt: boolean
}

const PromptUnsavedChanges: React.FC<PropTypes> = ({
  uniqueComponentId: currentId,
  shouldShowPrompt,
}) => {
  let [unsavedFormIds, setUnsavedFormIds] = useStateValue('unsavedFormIds')
  let nextUnsavedIds = [...unsavedFormIds]
  useEffect(() => {
    if (shouldShowPrompt) {
      nextUnsavedIds.push(currentId)
    } else {
      nextUnsavedIds = nextUnsavedIds.filter((id) => id !== currentId)
    }
    setUnsavedFormIds(nextUnsavedIds)
  }, [shouldShowPrompt])
  return null
}

export default PromptUnsavedChanges
