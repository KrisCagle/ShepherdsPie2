using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShepherdsPies.Data;
using ShepherdsPies.Models;
using System.Security.Claims;

namespace ShepherdsPies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ShepherdsPiesDbContext _dbContext;

        public EmployeeController(ShepherdsPiesDbContext context)
        {
            _dbContext = context;
        }
        [HttpGet]
        [Authorize]
        public IActionResult GetAllEmployees()
        {
            List<Employee> employees = _dbContext.Employees.ToList();
            return Ok(employees);
        }
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetEmployeeById(int id)
        {
            Employee employee = _dbContext.Employees.FirstOrDefault(e => e.EmployeeId == id);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }  
        [HttpGet("current")]
        [Authorize]
        public IActionResult GetCurrentEmployee()
        {
            string identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Employee employee = _dbContext.Employees
            .FirstOrDefault(e => e.IdentityUserId == identityUserId);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }  
    }
}