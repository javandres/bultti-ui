import { observer } from 'mobx-react-lite'
import { languageState } from '../state/UIStore'
import { get } from 'lodash'

const languageFiles = {
  fi: require('../text/fi.json'),
}

export type Language = 'fi'

export function translate(token: string, language: Language = 'fi') {
  const languageFile = get(languageFiles, `${language}`, false)

  if (!languageFile) {
    console.error('No language file found for language: ' + language)
  }

  const languageStr = languageFile[token]

  if (!languageStr) {
    return token
  }

  return languageStr
}

export function text(token) {
  const selectedLanguage = languageState.language
  return translate(token, selectedLanguage)
}

export const Text = observer(({ children }: { children?: string }) => {
  const selectedLanguage = languageState.language

  if (!children) {
    return ''
  }

  return translate(children, selectedLanguage)
})
