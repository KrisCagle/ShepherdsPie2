const _apiUrl = "/api/pizza"

export const addPizzaToOrder = (pizzaData) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(pizzaData)
  }).then((res) => res.json())
}

export const removePizza = (pizzaId) => {
  return fetch(`${_apiUrl}/${pizzaId}`, {
    method: "DELETE",
    credentials: "include"
  })
}

export const updatePizza = (pizzaId, pizzaData) => {
  return fetch(`${_apiUrl}/${pizzaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(pizzaData)
  })
}

export const addTopping = (pizzaId, toppingId) => {
  return fetch(`${_apiUrl}/${pizzaId}/toppings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ toppingId })
  })
}

export const removeTopping = (pizzaId, toppingId) => {
  return fetch(`${_apiUrl}/${pizzaId}/toppings/${toppingId}`, {
    method: "DELETE",
    credentials: "include"
  })
}