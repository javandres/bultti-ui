type ValueOf<T> = T[keyof T]

// Transforms keys of obj to new keys from keyMap.
// Removes fields not present in keyMap.

export function transformKeys(
  obj: { [key: string]: unknown },
  keyMap: { [key in keyof typeof obj]: string }
) {
  let entries = Object.entries(obj)

  return entries.reduce(
    (objNewKeys: { [key in ValueOf<typeof keyMap>]: ValueOf<typeof obj> }, [key, value]) => {
      let newKey = keyMap[key]

      if (newKey) {
        objNewKeys[newKey] = value
      }

      return objNewKeys
    },
    {}
  )
}
