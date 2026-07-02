using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShepherdsPies.Data;

namespace ShepherdsPies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MenuController : ControllerBase
    {
        private readonly ShepherdsPiesDbContext _dbContext;

        public MenuController(ShepherdsPiesDbContext context)
        {
            _dbContext = context;
        }

        [HttpGet("sizes")]
        public IActionResult GetSizes()
        {
            return Ok(_dbContext.Sizes.ToList());
        }

        [HttpGet("cheeses")]
        public IActionResult GetCheeses()
        {
            return Ok(_dbContext.Cheeses.ToList());
        }

        [HttpGet("sauces")]
        public IActionResult GetSauces()
        {
            return Ok(_dbContext.Sauces.ToList());
        }

        [HttpGet("toppings")]
        public IActionResult GetToppings()
        {
            return Ok(_dbContext.Toppings.ToList());
        }
    }
}