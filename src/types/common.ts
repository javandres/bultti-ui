export interface FunctionMap {
  [name: string]: (...args: any[]) => any
}

export type AnyFunction<T = any, ReturnT = any> = (...args: T[]) => ReturnT
