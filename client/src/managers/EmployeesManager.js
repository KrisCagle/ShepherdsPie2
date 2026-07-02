const _apiUrl = "/api/employees"

export const getAllEmployees = () => {
  return fetch(_apiUrl, {
    credentials: "include"
  }).then((res) => res.json())
}