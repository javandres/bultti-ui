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
    let newUnsavedFormIds = unsavedFormIds ? unsavedFormIds : []
    if (shouldShowPrompt) {
      newUnsavedFormIds.push(currentId)
    } else {
      newUnsavedFormIds = newUnsavedFormIds.filter((id) => id !== currentId)
    }
    setUnsavedFormIds(newUnsavedFormIds)
  }, [shouldShowPrompt])
  return null
}

export default PromptUnsavedChanges
