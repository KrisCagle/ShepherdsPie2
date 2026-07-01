const _apiUrl = "/api/account"

export const register = (registerData) => {
  return fetch(`${_apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(registerData)
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error("Registration failed")
  })
}

export const login = (loginData) => {
  return fetch(`${_apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(loginData)
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error("Login failed")
  })
}

export const logout = () => {
  return fetch(`${_apiUrl}/logout`, {
    method: "POST",
    credentials: "include"
  })
}

export const getLoggedInEmployee = () => {
  return fetch(`${_apiUrl}/me`, {
    credentials: "include"
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    return null
  })
}