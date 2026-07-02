using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShepherdsPies.Data;
using ShepherdsPies.Models;
using ShepherdsPies.Models.DTOs;
using Microsoft.AspNetCore.Authentication;

namespace ShepherdsPies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ShepherdsPiesDbContext _dbContext;

        public AccountController(UserManager<IdentityUser> userManager, ShepherdsPiesDbContext context)
        {
            _userManager = userManager;
            _dbContext = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDto)
        {
            IdentityUser identityUser = new IdentityUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            IdentityResult result = await _userManager.CreateAsync(identityUser, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            Employee employee = new Employee
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                IdentityUserId = identityUser.Id
            };

            _dbContext.Employees.Add(employee);
            _dbContext.SaveChanges();

            await SignInEmployee(identityUser);

            return Ok(employee);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            IdentityUser identityUser = await _userManager.FindByNameAsync(loginDto.Username);

            if (identityUser == null)
            {
                return Unauthorized();
            }

            bool passwordValid = await _userManager.CheckPasswordAsync(identityUser, loginDto.Password);

            if (!passwordValid)
            {
                return Unauthorized();
            }

            await SignInEmployee(identityUser);

            Employee employee = _dbContext.Employees
                .FirstOrDefault(e => e.IdentityUserId == identityUser.Id);

            return Ok(employee);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return NoContent();
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetLoggedInEmployee()
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

        private async Task SignInEmployee(IdentityUser identityUser)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, identityUser.Id),
                new Claim(ClaimTypes.Name, identityUser.UserName)
            };

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            ClaimsPrincipal principal = new ClaimsPrincipal(claimsIdentity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }
    }
}