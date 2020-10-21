import _ from 'lodash'
import React, { useRef } from 'react'
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
  const prevIdRef = useRef(currentId)
  let [unsavedFormIds, setUnsavedFormIds] = useStateValue('unsavedFormIds')
  let [, removeUnsavedFormId] = useStateValue('removeUnsavedFormId')

  const prevId: string = prevIdRef.current
  useEffect(() => {
    let newUnsavedFormIds = unsavedFormIds ? _.cloneDeep(unsavedFormIds) : []
    // In case of id has changed, remove old id
    if (prevId !== currentId) {
      newUnsavedFormIds = newUnsavedFormIds.filter((id) => id !== prevId)
      prevIdRef.current = currentId
    }
    if (shouldShowPrompt) {
      newUnsavedFormIds = newUnsavedFormIds ? newUnsavedFormIds.concat(currentId) : [currentId]
    } else {
      newUnsavedFormIds = newUnsavedFormIds.filter((id) => id !== currentId)
    }
    setUnsavedFormIds(newUnsavedFormIds)
    return () => {
      removeUnsavedFormId(currentId)
    }
  }, [shouldShowPrompt])

  return null
}

export default PromptUnsavedChanges
