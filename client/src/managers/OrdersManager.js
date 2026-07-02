const _apiUrl = "/api/orders"

export const getOrders = (date) => {
  const query = date ? `?date=${date}` : ""
  return fetch(`${_apiUrl}${query}`, {
    credentials: "include"
  }).then((res) => res.json())
}

export const getOrderById = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    credentials: "include"
  }).then((res) => res.json())
}

export const createOrder = (orderData) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(orderData)
  }).then((res) => res.json())
}

export const assignDeliveryEmployee = (orderId, deliveryEmployeeId) => {
  return fetch(`${_apiUrl}/${orderId}/delivery`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ deliveryEmployeeId })
  })
}

export const cancelOrder = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE",
    credentials: "include"
  })
}