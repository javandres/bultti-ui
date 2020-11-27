import { useObserver } from 'mobx-react-lite'
import { languageState } from '../state/UIStore'
import { translate } from './translate'

export const useTooltip = (helpText) => {
  return useObserver(() => {
    const selectedLanguage = languageState.language
    const translatedText = translate(helpText, selectedLanguage)

    return {
      title: (translatedText || '').replace('&shy;', ''), // Some texts may have shy linebreaks
    }
  })
}
