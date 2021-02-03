import { useObserver } from 'mobx-react-lite'
import { text } from './translate'

export const useTooltip = (helpText) => {
  return useObserver(() => {
    const translatedText = text(helpText)

    return {
      title: (translatedText || '').replace('&shy;', ''), // Some texts may have shy linebreaks
    }
  })
}
