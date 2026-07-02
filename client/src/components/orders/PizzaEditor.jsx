import { useState } from "react"
import { updatePizza, addTopping, removeTopping } from "../../managers/PizzaManager"

const TOPPING_PRICE = 0.5

export default function PizzaEditor({ pizza, sizes, cheeses, sauces, toppings, onChange, onClose }) {
  const [sizeId, setSizeId] = useState(pizza.sizeId)
  const [cheeseId, setCheeseId] = useState(pizza.cheeseId)
  const [sauceId, setSauceId] = useState(pizza.sauceId)

  const currentToppingIds = pizza.pizzaToppings?.map((pt) => pt.toppingId) ?? []

  const handleSave = (event) => {
    event.preventDefault()
    updatePizza(pizza.pizzaId, {
      sizeId: Number(sizeId),
      cheeseId: Number(cheeseId),
      sauceId: Number(sauceId)
    }).then(() => {
      onChange()
      onClose()
    })
  }

  const handleToggleTopping = (toppingId, isChecked) => {
    const action = isChecked
      ? addTopping(pizza.pizzaId, toppingId)
      : removeTopping(pizza.pizzaId, toppingId)

    action.then(onChange)
  }

  return (
    <div>
      <h4>Edit pizza</h4>
      <form onSubmit={handleSave}>
        <select value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
          {sizes.map((size) => (
            <option key={size.sizeId} value={size.sizeId}>
              {size.name} (${size.price.toFixed(2)})
            </option>
          ))}
        </select>

        <select value={cheeseId} onChange={(e) => setCheeseId(e.target.value)}>
          {cheeses.map((cheese) => (
            <option key={cheese.cheeseId} value={cheese.cheeseId}>
              {cheese.name}
            </option>
          ))}
        </select>

        <select value={sauceId} onChange={(e) => setSauceId(e.target.value)}>
          {sauces.map((sauce) => (
            <option key={sauce.sauceId} value={sauce.sauceId}>
              {sauce.name}
            </option>
          ))}
        </select>

        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>

      <h5>Toppings (${TOPPING_PRICE.toFixed(2)} each)</h5>
      {toppings.map((topping) => (
        <label key={topping.toppingId} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={currentToppingIds.includes(topping.toppingId)}
            onChange={(e) => handleToggleTopping(topping.toppingId, e.target.checked)}
          />
          {topping.name}
        </label>
      ))}
    </div>
  )
}