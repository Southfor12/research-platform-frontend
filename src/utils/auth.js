import { setLocalStorage, getLocalStorage, removeLocalStorage } from './local-storage'

export function getToken() {
  return getLocalStorage('token')
}

export function setToken(token) {
  return setLocalStorage('token', token, 8 * 60 - 1)
}

export function removeToken() {
  return removeLocalStorage('token')
}
