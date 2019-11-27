import { SERVER_URL } from '../constants'
import { AuthResponse } from '../types/authentication'

const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

const Endpoint = {
  LOGIN: 'login',
  SESSION: 'session',
  LOGOUT: 'logout',
}

let BACKEND_API_URL = SERVER_URL

if (!BACKEND_API_URL.endsWith('/')) {
  BACKEND_API_URL = BACKEND_API_URL + '/'
}

export const authorize = async (code, isTest = false) => {
  const requestBody = { code, isTest }
  return sendRequest(RequestMethod.POST, requestBody)
}

const sendRequest = async (method, requestBody): Promise<AuthResponse> => {
  let result = null

  try {
    const response = await fetch(BACKEND_API_URL + Endpoint.LOGIN, {
      method,
      credentials: 'include',
      body: JSON.stringify(requestBody),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    result = await response.json()
  } catch (e) {
    console.log(e)
  }

  return result
}

export const checkExistingSession = async (): Promise<AuthResponse> => {
  let result = null

  try {
    const response = await fetch(BACKEND_API_URL + Endpoint.SESSION, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    result = await response.json()
  } catch (e) {
    console.log(e)
  }

  return result
}

export const logout = async () => {
  let result = null

  try {
    const response = await fetch(BACKEND_API_URL + Endpoint.LOGOUT, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    result = await response.json()
  } catch (e) {
    console.log(e)
  }

  return result
}
