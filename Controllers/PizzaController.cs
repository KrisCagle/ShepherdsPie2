using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShepherdsPies.Data;
using ShepherdsPies.Models;
using ShepherdsPies.Models.DTOs;

namespace ShepherdsPies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PizzaController : ControllerBase
    {
        private readonly ShepherdsPiesDbContext _dbContext;

        public PizzaController(ShepherdsPiesDbContext context)
        {
            _dbContext = context;
        }

        // POST /api/pizza
        [HttpPost]
        public IActionResult AddPizzaToOrder(CreatePizzaDTO pizzaDto)
        {
            bool orderExists = _dbContext.Orders.Any(o => o.OrderId == pizzaDto.OrderId);
            if (!orderExists)
            {
                return BadRequest("Order not found.");
            }

            Pizza pizza = new Pizza
            {
                OrderId = pizzaDto.OrderId,
                SizeId = pizzaDto.SizeId,
                CheeseId = pizzaDto.CheeseId,
                SauceId = pizzaDto.SauceId
            };

            _dbContext.Pizzas.Add(pizza);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetPizzaById), new { id = pizza.PizzaId }, pizza);
        }

        // GET /api/pizza/5
        [HttpGet("{id}")]
        public IActionResult GetPizzaById(int id)
        {
            Pizza pizza = _dbContext.Pizzas
                .Include(p => p.Size)
                .Include(p => p.Cheese)
                .Include(p => p.Sauce)
                .Include(p => p.PizzaToppings).ThenInclude(pt => pt.Topping)
                .FirstOrDefault(p => p.PizzaId == id);

            if (pizza == null)
            {
                return NotFound();
            }

            return Ok(pizza);
        }

        // PUT /api/pizza/5
        [HttpPut("{id}")]
        public IActionResult UpdatePizza(int id, UpdatePizzaDTO pizzaDto)
        {
            Pizza pizza = _dbContext.Pizzas.FirstOrDefault(p => p.PizzaId == id);
            if (pizza == null)
            {
                return NotFound();
            }

            pizza.SizeId = pizzaDto.SizeId;
            pizza.CheeseId = pizzaDto.CheeseId;
            pizza.SauceId = pizzaDto.SauceId;

            _dbContext.SaveChanges();
            return NoContent();
        }

        // DELETE /api/pizza/5
        [HttpDelete("{id}")]
        public IActionResult RemovePizzaFromOrder(int id)
        {
            Pizza pizza = _dbContext.Pizzas.FirstOrDefault(p => p.PizzaId == id);
            if (pizza == null)
            {
                return NotFound();
            }

            _dbContext.Pizzas.Remove(pizza);
            _dbContext.SaveChanges();
            return NoContent();
        }

        // POST /api/pizza/5/toppings
        [HttpPost("{id}/toppings")]
        public IActionResult AddTopping(int id, AddToppingDTO toppingDto)
        {
            bool pizzaExists = _dbContext.Pizzas.Any(p => p.PizzaId == id);
            if (!pizzaExists)
            {
                return NotFound("Pizza not found.");
            }

            bool alreadyHasTopping = _dbContext.PizzaToppings
                .Any(pt => pt.PizzaId == id && pt.ToppingId == toppingDto.ToppingId);
            if (alreadyHasTopping)
            {
                return BadRequest("This topping is already on the pizza.");
            }

            PizzaTopping pizzaTopping = new PizzaTopping
            {
                PizzaId = id,
                ToppingId = toppingDto.ToppingId
            };

            _dbContext.PizzaToppings.Add(pizzaTopping);
            _dbContext.SaveChanges();

            return Ok(pizzaTopping);
        }

        // DELETE /api/pizza/5/toppings/3
        [HttpDelete("{pizzaId}/toppings/{toppingId}")]
        public IActionResult RemoveTopping(int pizzaId, int toppingId)
        {
            PizzaTopping pizzaTopping = _dbContext.PizzaToppings
                .FirstOrDefault(pt => pt.PizzaId == pizzaId && pt.ToppingId == toppingId);

            if (pizzaTopping == null)
            {
                return NotFound();
            }

            _dbContext.PizzaToppings.Remove(pizzaTopping);
            _dbContext.SaveChanges();
            return NoContent();
        }
    }
}