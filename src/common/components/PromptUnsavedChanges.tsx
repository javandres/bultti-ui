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
  useEffect(() => {
    if (shouldShowPrompt) {
      unsavedFormIds.push(currentId)
    } else {
      unsavedFormIds = unsavedFormIds.filter((id) => id !== currentId)
    }
    setUnsavedFormIds(unsavedFormIds)
  }, [shouldShowPrompt])
  return null
}

export default PromptUnsavedChanges
