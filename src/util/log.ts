import { isObservable, toJS } from 'mobx'

type LogLevel = 'warn' | 'error' | 'log'

export function logWithLevel(level: LogLevel, ...values: any[]) {
  const { info = [], errors = [] } = values.reduce(
    (messages, val) => {
      if (isObservable(val)) {
        messages.info.push(toJS(val))
      } else if (typeof val?.stack !== 'undefined') {
        messages.errors.push(val)
      } else {
        messages.info.push(val)
      }

      return messages
    },
    { info: [], errors: [] }
  )

  if (info.length !== 0) {
    console[level](...info)
  }

  if (errors.length !== 0) {
    console.error(...errors)
  }
}

export function log(...values: any[]) {
  return logWithLevel('log', ...values)
}
