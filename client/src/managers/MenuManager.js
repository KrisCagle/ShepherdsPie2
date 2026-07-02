const _apiUrl = "/api/menu"

export const getSizes = () => {
  return fetch(`${_apiUrl}/sizes`, {
    credentials: "include"
  }).then((res) => res.json())
}

export const getCheeses = () => {
  return fetch(`${_apiUrl}/cheeses`, {
    credentials: "include"
  }).then((res) => res.json())
}

export const getSauces = () => {
  return fetch(`${_apiUrl}/sauces`, {
    credentials: "include"
  }).then((res) => res.json())
}

export const getToppings = () => {
  return fetch(`${_apiUrl}/toppings`, {
    credentials: "include"
  }).then((res) => res.json())
}