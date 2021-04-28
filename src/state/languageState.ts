// Language state is separate because some parts of the app that aren't
// in the scope of the React component tree may want to use it.
import { Language } from '../util/translate'
import { action, observable } from 'mobx'

export const languageState: { language: Language } = observable({
  language: 'fi',
})
export const setLanguage = action((setTo: Language = 'fi') => {
  languageState.language = setTo
})
