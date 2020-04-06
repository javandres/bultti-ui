import { SERVER_URL } from '../constants'

const Endpoint = {
  LOGIN: 'login',
  SESSION: 'session',
  LOGOUT: 'logout',
}

let BACKEND_API_URL = SERVER_URL

if (!BACKEND_API_URL.endsWith('/')) {
  BACKEND_API_URL = BACKEND_API_URL + '/'
}

export const logout = async () => {
  let result: boolean = false

  try {
    const response = await fetch(BACKEND_API_URL + Endpoint.LOGOUT, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    result = response.status === 200
  } catch (e) {
    console.log(e)
  }

  return result
}
