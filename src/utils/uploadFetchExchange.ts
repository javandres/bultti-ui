import { print } from 'graphql'
import { extractFiles } from 'extract-files'
import { filter, make, merge, mergeMap, pipe, share, takeUntil } from 'wonka'
import { Exchange, Operation, OperationResult } from 'urql'

interface Body {
  query: string
  variables: void | object
  operationName?: string
}

/** A default exchange for fetching GraphQL requests. */
export const fetchExchange: Exchange = ({ forward }) => {
  const isOperationFetchable = (operation: Operation) => {
    const { operationName } = operation
    return operationName === 'query' || operationName === 'mutation'
  }

  return (ops$) => {
    const sharedOps$ = share(ops$)
    const fetchResults$ = pipe(
      sharedOps$,
      filter(isOperationFetchable),
      mergeMap((operation) => {
        const { key } = operation
        const teardown$ = pipe(
          sharedOps$,
          filter((op: any) => op?.operationName === 'teardown' && op?.key === key)
        )

        return pipe(createFetchSource(operation), takeUntil(teardown$))
      })
    )

    const forward$ = pipe(
      sharedOps$,
      filter((op) => !isOperationFetchable(op)),
      forward
    )

    return merge([fetchResults$, forward$])
  }
}

const createFetchSource = (operation: Operation) => {
  if (process.env.NODE_ENV !== 'production' && operation.operationName === 'subscription') {
    throw new Error(
      'Received a subscription operation in the httpExchange. You are probably trying to create a subscription. Have you added a subscriptionExchange?'
    )
  }

  return make<OperationResult>(([next, complete]) => {
    const abortController =
      typeof AbortController !== 'undefined' ? new AbortController() : undefined

    const { context } = operation

    const extraOptions =
      typeof context.fetchOptions === 'function'
        ? context.fetchOptions()
        : context.fetchOptions || {}

    const fetchOptions = {
      method: 'POST',
      headers: {},
      ...extraOptions,
      signal: abortController !== undefined ? abortController.signal : undefined,
    }
    const { files } = extractFiles(operation.variables)
    const isFileUpload = !!files.size

    if (isFileUpload) {
      fetchOptions.body = new FormData()

      fetchOptions.body.append(
        'operations',
        JSON.stringify({
          query: print(operation.query),
          variables: Object.assign({}, operation.variables),
        })
      )

      const map = {}
      let i = 0

      files.forEach((paths) => {
        map[++i] = paths.map((path) => `variables.${path}`)
      })

      fetchOptions.body.append('map', JSON.stringify(map))

      i = 0
      files.forEach((paths, file) => {
        // @ts-ignore
        fetchOptions.body.append(`${++i}`, file, file.name)
      })
    } else {
      fetchOptions.body = JSON.stringify({
        query: print(operation.query),
        variables: operation.variables,
      })
      fetchOptions.headers['content-type'] = 'application/json'
    }

    executeFetch(operation, fetchOptions).then((result) => {
      if (result !== undefined) {
        next({
          ...result,
        })
      }

      complete()
    })

    return () => {
      if (abortController !== undefined) {
        abortController.abort()
      }
    }
  })
}

const executeFetch = (operation: Operation, opts: RequestInit) => {
  const { url, fetch: fetcher } = operation.context

  return (fetcher || fetch)(url, opts)
    .then((res) => {
      checkStatus(opts.redirect, res)
      return res.json()
    })
    .then((result) => ({
      operation,
      data: result.data,
      extensions:
        typeof result.extensions === 'object' && result.extensions !== null
          ? result.extensions
          : undefined,
    }))
    .catch((err) => {
      if (err.name === 'AbortError') {
        return undefined
      }

      return {
        operation,
        data: undefined,
        extensions: undefined,
      }
    })
}

const checkStatus = (redirectMode = 'follow', response) => {
  const statusRangeEnd = redirectMode === 'manual' ? 400 : 300

  if (response.status < 200 || response.status >= statusRangeEnd) {
    throw new Error(response.statusText)
  }
}
