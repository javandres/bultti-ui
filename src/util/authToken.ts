const AUTH_TOKEN_KEY = 'bultti_auth_token'

export function saveAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  return token
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function removeAuthToken() {
  return localStorage.removeItem(AUTH_TOKEN_KEY)
}
