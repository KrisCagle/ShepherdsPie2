import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getOrderById, assignDeliveryEmployee, cancelOrder } from "../../managers/OrdersManager"
import { getAllEmployees } from "../../managers/EmployeesManager"
import { getSizes, getCheeses, getSauces, getToppings } from "../../managers/MenuManager"
import { addPizzaToOrder, removePizza } from "../../managers/PizzaManager"
import PizzaEditor from "./PizzaEditor"

const DELIVERY_SURCHARGE = 5.0
const TOPPING_PRICE = 0.5

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [employees, setEmployees] = useState([])
  const [selectedDeliveryEmployeeId, setSelectedDeliveryEmployeeId] = useState("")

  const [sizes, setSizes] = useState([])
  const [cheeses, setCheeses] = useState([])
  const [sauces, setSauces] = useState([])
  const [toppings, setToppings] = useState([])
  const [newPizza, setNewPizza] = useState({ sizeId: "", cheeseId: "", sauceId: "" })
  const [editingPizzaId, setEditingPizzaId] = useState(null)

  const loadOrder = () => {
    getOrderById(orderId).then(setOrder)
  }

  useEffect(() => {
    loadOrder()
    getAllEmployees().then(setEmployees)
    getSizes().then(setSizes)
    getCheeses().then(setCheeses)
    getSauces().then(setSauces)
    getToppings().then(setToppings)
  }, [orderId])

  if (!order) {
    return <div className="page"><p>Loading...</p></div>
  }

  const calculatePizzaCost = (pizza) => {
    const basePrice = pizza.size?.price ?? 0
    const toppingsCost = (pizza.pizzaToppings?.length ?? 0) * TOPPING_PRICE
    return basePrice + toppingsCost
  }

  const pizzasTotal = order.pizzas?.reduce(
    (sum, pizza) => sum + calculatePizzaCost(pizza),
    0
  ) ?? 0

  const isDelivery = order.deliveryEmployeeId != null
  const totalCost = pizzasTotal + (isDelivery ? DELIVERY_SURCHARGE : 0)

  const handleAssignDelivery = () => {
    if (!selectedDeliveryEmployeeId) return
    assignDeliveryEmployee(order.orderId, Number(selectedDeliveryEmployeeId)).then(loadOrder)
  }

  const handleCancel = () => {
    if (window.confirm("Cancel this order? This cannot be undone.")) {
      cancelOrder(order.orderId).then(() => navigate("/"))
    }
  }

  const handleAddPizza = (event) => {
    event.preventDefault()
    if (!newPizza.sizeId || !newPizza.cheeseId || !newPizza.sauceId) return

    addPizzaToOrder({
      orderId: order.orderId,
      sizeId: Number(newPizza.sizeId),
      cheeseId: Number(newPizza.cheeseId),
      sauceId: Number(newPizza.sauceId)
    }).then(() => {
      setNewPizza({ sizeId: "", cheeseId: "", sauceId: "" })
      loadOrder()
    })
  }

  const handleRemovePizza = (pizzaId) => {
    removePizza(pizzaId).then(loadOrder)
  }

  return (
    <div className="page">
      <span className="eyebrow" style={{fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--tomato)"}}>
        Order #{order.orderId}
      </span>
      <h1>
        {order.tableNumber ? `Table ${order.tableNumber}` : "Delivery"}
        {isDelivery && <span className="badge" style={{marginLeft: "0.6rem"}}>Delivery</span>}
      </h1>
      <p>Order taken by: {order.orderTakenBy?.firstName} {order.orderTakenBy?.lastName}</p>
      <p>Placed: {new Date(order.orderDate).toLocaleString()}</p>
      <p>Tip: {order.tipAmount != null ? `$${order.tipAmount.toFixed(2)}` : "None recorded"}</p>

      <h2>Pizzas</h2>
      {order.pizzas?.length === 0 && <p>No pizzas on this order yet.</p>}
      <ul className="pizza-list">
        {order.pizzas?.map((pizza) => (
          <li key={pizza.pizzaId} className="pizza-row">
            <div className="pizza-row-top">
              <div>
                {pizza.size?.name}, {pizza.cheese?.name}, {pizza.sauce?.name}
                {pizza.pizzaToppings?.length > 0 && (
                  <div className="ticket-meta">
                    {pizza.pizzaToppings.map((pt) => pt.topping?.name).join(", ")}
                  </div>
                )}
              </div>
              <span className="price">${calculatePizzaCost(pizza).toFixed(2)}</span>
            </div>
            <div className="pizza-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setEditingPizzaId(editingPizzaId === pizza.pizzaId ? null : pizza.pizzaId)}
              >
                {editingPizzaId === pizza.pizzaId ? "Close" : "Edit"}
              </button>
              <button type="button" className="danger" onClick={() => handleRemovePizza(pizza.pizzaId)}>
                Remove
              </button>
            </div>

            {editingPizzaId === pizza.pizzaId && (
              <div className="editor-panel">
                <PizzaEditor
                  pizza={pizza}
                  sizes={sizes}
                  cheeses={cheeses}
                  sauces={sauces}
                  toppings={toppings}
                  onChange={loadOrder}
                  onClose={() => setEditingPizzaId(null)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3>Add a pizza</h3>
      <form className="inline-form" onSubmit={handleAddPizza}>
        <select
          value={newPizza.sizeId}
          onChange={(e) => setNewPizza({ ...newPizza, sizeId: e.target.value })}
        >
          <option value="">Size</option>
          {sizes.map((size) => (
            <option key={size.sizeId} value={size.sizeId}>
              {size.name} (${size.price.toFixed(2)})
            </option>
          ))}
        </select>

        <select
          value={newPizza.cheeseId}
          onChange={(e) => setNewPizza({ ...newPizza, cheeseId: e.target.value })}
        >
          <option value="">Cheese</option>
          {cheeses.map((cheese) => (
            <option key={cheese.cheeseId} value={cheese.cheeseId}>
              {cheese.name}
            </option>
          ))}
        </select>

        <select
          value={newPizza.sauceId}
          onChange={(e) => setNewPizza({ ...newPizza, sauceId: e.target.value })}
        >
          <option value="">Sauce</option>
          {sauces.map((sauce) => (
            <option key={sauce.sauceId} value={sauce.sauceId}>
              {sauce.name}
            </option>
          ))}
        </select>

        <button type="submit">Add pizza</button>
      </form>

      <div className="total-line">
        Total: ${totalCost.toFixed(2)}
        {isDelivery && " (incl. $5.00 delivery)"}
      </div>

      {!isDelivery && (
        <div className="delivery-box">
          <label htmlFor="deliveryEmployee">Assign delivery employee</label>
          <select
            id="deliveryEmployee"
            value={selectedDeliveryEmployeeId}
            onChange={(event) => setSelectedDeliveryEmployeeId(event.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          <button type="button" className="secondary" onClick={handleAssignDelivery}>
            Assign
          </button>
        </div>
      )}

      {isDelivery && (
        <p>
          Delivering: {order.deliveryEmployee?.firstName} {order.deliveryEmployee?.lastName}
        </p>
      )}

      <button type="button" className="danger" onClick={handleCancel}>
        Cancel order
      </button>
    </div>
  )
}