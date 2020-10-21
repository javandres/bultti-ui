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
    let tempIds = unsavedFormIds ? _.cloneDeep(unsavedFormIds) : []
    if (prevId !== currentId) {
      tempIds = tempIds.filter((id) => id !== prevId)
      prevIdRef.current = currentId
      setUnsavedFormIds(tempIds)
    }

    let newUnsavedFormIds
    if (shouldShowPrompt) {
      newUnsavedFormIds = tempIds ? _.uniq(tempIds.concat(currentId)) : [currentId]
      setUnsavedFormIds(newUnsavedFormIds)
    } else {
      newUnsavedFormIds = tempIds.filter((id) => id !== currentId)
    }
    if (!_.isEqual(newUnsavedFormIds, unsavedFormIds)) {
      setUnsavedFormIds(newUnsavedFormIds)
    }
    return () => {
      removeUnsavedFormId(currentId)
    }
  }, [shouldShowPrompt])
  console.log('ids ', unsavedFormIds)

  return null
}

export default PromptUnsavedChanges
