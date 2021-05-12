import React, { useCallback, useContext, useEffect, useState } from 'react'
import { text } from './translate'

const UnsavedChangesContext = React.createContext({
  registerDirtyForm: () => {},
  resetDirtyForms: () => {},
  dirtyFormsCount: 0,
})

export function UnsavedChangesProvider({ children }) {
  let [dirtyFormsCount, setDirtyFormsCount] = useState<number>(0)

  const resetDirtyForms = useCallback(() => {
    setDirtyFormsCount(0)
  }, [])

  const registerDirtyForm = useCallback(() => {
    setDirtyFormsCount((current) => current + 1)
    return () => setDirtyFormsCount((current) => Math.max(0, current - 1))
  }, [])

  useEffect(() => {
    let listener = function (event: BeforeUnloadEvent) {
      if (dirtyFormsCount > 0) {
        event.preventDefault()
        // Chrome requires event.returnValue to be cleared.
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', listener)
    return () => window.removeEventListener('beforeunload', listener)
  }, [dirtyFormsCount, resetDirtyForms])

  return (
    <UnsavedChangesContext.Provider
      value={{ registerDirtyForm, resetDirtyForms, dirtyFormsCount }}>
      {children}
    </UnsavedChangesContext.Provider>
  )
}

export const useWatchDirtyForm = (isDirty: boolean = false) => {
  let { registerDirtyForm } = useContext(UnsavedChangesContext)

  useEffect(() => {
    if (isDirty) {
      return registerDirtyForm()
    }
  }, [isDirty, registerDirtyForm])
}

export function useUnsavedChangesPrompt(): [boolean, string] {
  let { dirtyFormsCount } = useContext(UnsavedChangesContext)
  let message = text('unsavedChangesPrompt')

  return [dirtyFormsCount > 0, message]
}

export function useGetUserConfirmation(): (
  message: string,
  callback: (allowTransition: boolean) => unknown
) => void {
  let { resetDirtyForms } = useContext(UnsavedChangesContext)

  return useCallback(
    (message, callback) => {
      let allowTransition = window.confirm(message)

      if (allowTransition) {
        resetDirtyForms()
      }

      callback(allowTransition)
    },
    [resetDirtyForms]
  )
}
