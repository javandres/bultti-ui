import { observer } from 'mobx-react-lite'
import { languageState } from '../state/UIStore'
import { get } from 'lodash'

// Text categories

const textCategories = {
  ui: {
    fi: require('../text/ui/fi.json'),
  },
  help: {
    fi: require('../text/help/fi.json'),
  },
}

export type TextCategory = 'ui' | 'help'
export type Language = 'fi'

export function translate(
  token: string,
  category: TextCategory = 'ui',
  language: Language = 'fi'
) {
  const languageFile = get(textCategories, `${category}.${language}`, false)

  if (!languageFile) {
    console.error('No language file found for language: ' + language)
  }

  const languageStr = languageFile[token]

  if (!languageStr) {
    return token
  }

  return languageStr
}

export function text(token, language) {
  return translate(token, 'ui', language)
}

export const Text = observer(
  ({ children, text: textToken = children }: { children?: any; text?: string }) => {
    const selectedLanguage = languageState.language
    return text(textToken, selectedLanguage)
  }
)
