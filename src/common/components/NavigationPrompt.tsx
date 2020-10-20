import { useEffect } from 'react'
import { useStateValue } from '../../state/useAppState'

export type PropTypes = {
  shouldShowPrompt: boolean
  message?: String
}
const DEFAULT_MESSAGE =
  'Sinulla on tallentamattomia muutoksia. Haluatko varmasti poistua näkymästä? Tallentamattomat muutokset kumotaan'

const PromptUnsavedChanges: React.FC<PropTypes> = ({
  shouldShowPrompt,
  message = DEFAULT_MESSAGE,
}) => {
  let [, setNavigationBlockedMessage] = useStateValue('navigationBlockedMessage')
  useEffect(() => {
    if (shouldShowPrompt) {
      setNavigationBlockedMessage(message)
    }
    return () => {
      setNavigationBlockedMessage('')
    }
  }, [shouldShowPrompt])
  return null
}

export default PromptUnsavedChanges
