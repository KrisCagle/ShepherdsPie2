using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShepherdsPies.Data;
using ShepherdsPies.Models;
using ShepherdsPies.Models.DTOs;
using System.Security.Claims;


namespace ShepherdsPies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ShepherdsPiesDbContext _dbContext;
        public OrdersController(ShepherdsPiesDbContext context)
        {
            _dbContext = context;
        }
    [HttpGet]
    public IActionResult GetOrders([FromQuery] DateTime? date)
        {
            DateTime targetDate = date ?? DateTime.Today;
            List<Order> orders = _dbContext.Orders
            .Include(o => o.OrderTakenBy)
            .Include(o => o.DeliveryEmployee)
            .Include(o => o.Pizzas)
            .Where(o => o.OrderDate.Date == targetDate.Date)
            .OrderByDescending(o => o.OrderDate)
            .ToList();
            return Ok(orders);
        }  
    [HttpGet("{id}")]
    public IActionResult GetOrderById(int id)
        {
            Order order = _dbContext.Orders
                .Include(o => o.OrderTakenBy)
                .Include(o => o.DeliveryEmployee)
                .Include(o => o.Pizzas).ThenInclude(p => p.Size)
                .Include(o => o.Pizzas).ThenInclude(p => p.Cheese)
                .Include(o => o.Pizzas).ThenInclude(p => p.Sauce)
                .Include(o => o.Pizzas).ThenInclude(p => p.PizzaToppings).ThenInclude(pt => pt.Topping)
                .FirstOrDefault(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        } 

    [HttpPost]
    public IActionResult CreateOrder(CreateOrderDTO orderDTO)
        {
            string identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Employee currentEmployee = _dbContext.Employees
            .FirstOrDefault( e => e.IdentityUserId == identityUserId);

            if (currentEmployee == null)
            {
                return Unauthorized("No employee record found for the current user");
            }
            Order order = new Order
            {
                TableNumber = orderDTO.TableNumber,
                OrderTakenByEmployeeId = currentEmployee.EmployeeId,
                OrderDate = DateTime.Now
            };
            _dbContext.Orders.Add(order);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetOrderById), new {id = order.OrderId}, order );
        }
    [HttpPut("{id}/delivery")]
    public IActionResult AssignDeliveryEmployee(int id, AssignDeliveryDTO deliveryDTO)
        {
            Order order = _dbContext.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }
            bool employeeExists = _dbContext.Employees.Any(e => e.EmployeeId == deliveryDTO.DeliveryEmployeeId);
            if (!employeeExists)
            {
                return BadRequest("Delivery employee not found.");
            }
            order.DeliveryEmployeeId = deliveryDTO.DeliveryEmployeeId;
            order.TableNumber = null;
            _dbContext.SaveChanges();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public IActionResult CancelOrder(int id)
        {
            Order order = _dbContext.Orders.FirstOrDefault( o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }
            _dbContext.Orders.Remove(order);
            _dbContext.SaveChanges();
        return NoContent();
       }

    }
}