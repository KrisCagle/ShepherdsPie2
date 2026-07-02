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
    <div className="page">
      <h1>Orders</h1>
      <div className="list-toolbar">
        <div className="form-group">
          <label htmlFor="orderDate">Date</label>
          <input
            id="orderDate"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>
        <Link to="/orders/new">
          <button type="button">New order</button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <p>No orders for this day yet.</p>
      ) : (
        <ul className="order-rail">
          {orders.map((order) => (
            <li key={order.orderId}>
              <Link to={`/orders/${order.orderId}`} className="ticket">
                <div className="ticket-heading">
                  {order.tableNumber ? `Table ${order.tableNumber}` : "Delivery"}
                </div>
                <div className="ticket-meta">
                  {order.pizzas?.length ?? 0} pizza(s) —{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}