import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders } from "../../managers/OrdersManager"

export default function OrderList() {
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders(selectedDate).then(setOrders)
  }, [selectedDate])

  return (
    <div>
      <h1>Orders</h1>
      <div>
        <label htmlFor="orderDate">Date</label>
        <input
          id="orderDate"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />
      </div>
      <Link to="/orders/new">New order</Link>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            <Link to={`/orders/${order.orderId}`}>
              {order.tableNumber
                ? `Table ${order.tableNumber}`
                : "Delivery"}{" "}
              — {order.pizzas?.length ?? 0} pizza(s) —{" "}
              {new Date(order.orderDate).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}