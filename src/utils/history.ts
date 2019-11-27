import { createBrowserHistory as createHistory } from 'history'
import { createContext } from 'react'

export const history = createHistory()
const HistoryContext = createContext(history)

export default HistoryContext
