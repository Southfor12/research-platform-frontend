
export function setLocalStorage(key, value, expired) {
  return localStorage.setItem(key, JSON.stringify({ data: value, expired: Date.now() + 1000 * 60 * expired }))
}

export function getLocalStorage(key) {
  const now = Date.now()
  const data = localStorage.getItem(key)
  if (!data) return false
  const dataObj = JSON.parse(data)
  if (now >= dataObj.expired) {
    removeLocalStorage(key)
    return false
  }
  return dataObj.data
}

export function removeLocalStorage(key) {
  return localStorage.removeItem(key)
}
