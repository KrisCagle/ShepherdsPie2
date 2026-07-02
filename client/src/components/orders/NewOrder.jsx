import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createOrder } from "../../managers/OrdersManager"

export default function NewOrder() {
  const [tableNumber, setTableNumber] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    const orderData = {
      tableNumber: tableNumber ? Number(tableNumber) : null
    }

    createOrder(orderData).then((order) => {
      navigate(`/orders/${order.orderId}`)
    })
  }

  return (
    <div className="page">
      <div className="auth-card">
        <h1>New order</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tableNumber">
              Table number (leave blank for delivery)
            </label>
            <input
              id="tableNumber"
              type="number"
              min="1"
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
            />
          </div>
          <button type="submit">Create order</button>
        </form>
      </div>
    </div>
  )
}