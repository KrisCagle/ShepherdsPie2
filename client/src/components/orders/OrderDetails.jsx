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
    return <p>Loading...</p>
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
    <div>
      <h1>
        {order.tableNumber ? `Table ${order.tableNumber}` : "Delivery"}
      </h1>
      <p>Order taken by: {order.orderTakenBy?.firstName} {order.orderTakenBy?.lastName}</p>
      <p>Placed: {new Date(order.orderDate).toLocaleString()}</p>
      <p>Tip: {order.tipAmount != null ? `$${order.tipAmount.toFixed(2)}` : "None recorded"}</p>

      <h2>Pizzas</h2>
      <ul>
        {order.pizzas?.map((pizza) => (
          <li key={pizza.pizzaId}>
            {pizza.size?.name}, {pizza.cheese?.name}, {pizza.sauce?.name}
            {pizza.pizzaToppings?.length > 0 && (
              <> — {pizza.pizzaToppings.map((pt) => pt.topping?.name).join(", ")}</>
            )}
            {" "}— ${calculatePizzaCost(pizza).toFixed(2)}
            {" "}
            <button onClick={() => setEditingPizzaId(pizza.pizzaId)}>Edit</button>
            <button onClick={() => handleRemovePizza(pizza.pizzaId)}>Remove</button>

            {editingPizzaId === pizza.pizzaId && (
              <PizzaEditor
                pizza={pizza}
                sizes={sizes}
                cheeses={cheeses}
                sauces={sauces}
                toppings={toppings}
                onChange={loadOrder}
                onClose={() => setEditingPizzaId(null)}
              />
            )}
          </li>
        ))}
      </ul>

      <h3>Add a pizza</h3>
      <form onSubmit={handleAddPizza}>
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

      <p>
        <strong>Total: ${totalCost.toFixed(2)}</strong>
        {isDelivery && " (includes $5.00 delivery surcharge)"}
      </p>

      {!isDelivery && (
        <div>
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
          <button onClick={handleAssignDelivery}>Assign</button>
        </div>
      )}

      {isDelivery && (
        <p>
          Delivering: {order.deliveryEmployee?.firstName} {order.deliveryEmployee?.lastName}
        </p>
      )}

      <button onClick={handleCancel}>Cancel order</button>
    </div>
  )
}