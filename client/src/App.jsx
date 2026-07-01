import { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { getLoggedInEmployee } from "./managers/AuthManager"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import OrderList from "./components/orders/OrderList"

export default function App() {
  const [loggedInEmployee, setLoggedInEmployee] = useState(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    getLoggedInEmployee().then((employee) => {
      setLoggedInEmployee(employee)
    })
  }, [])

  if (loggedInEmployee === undefined) {
    return <p>Loading...</p>
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setLoggedInEmployee={setLoggedInEmployee} />}
      />
      <Route
        path="/register"
        element={<Register setLoggedInEmployee={setLoggedInEmployee} />}
      />
      <Route
        path="/"
        element={
  loggedInEmployee ? (
    <OrderList />
  ) : (
    <Login setLoggedInEmployee={setLoggedInEmployee} />
  )
}
      />
    </Routes>
  )
}