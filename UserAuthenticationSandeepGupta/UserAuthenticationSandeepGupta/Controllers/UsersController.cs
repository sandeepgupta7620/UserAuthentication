using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UserAuthenticationSandeepGupta.Models;

namespace UserAuthenticationSandeepGupta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public UsersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("signup")]
        public async Task<ActionResult> Register([FromBody] User user)
        {
            
           
            if (_context.UsersAuthenticationSandeep.Any(u => u.Username == user.Username || u.Email == user.Email))
                return BadRequest("Username or Email already exists");

            // Ensure PasswordHash is not empty and hash the password
            if (string.IsNullOrEmpty(user.PasswordHash))
                return BadRequest("Password is required");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            user.CreatedAt = DateTime.Now;
            //user.SignupIPAddress = user.SignupIPAddress;
            _context.UsersAuthenticationSandeep.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] User login)
        {
            var UserID = 0;
            var Username = "";
            

            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.PasswordHash))
                return BadRequest("Invalid login request");

            var user = await _context.UsersAuthenticationSandeep.FirstOrDefaultAsync(u => u.Email == login.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.PasswordHash, user.PasswordHash))
            {
                // Log failed login attempt
                var failedLogin = new LoginCheck
                {
                    UserId = user != null ? user.UserId : 0,  // If user is null, store 0 or handle this case separately
                    IsValid = "False",
                    CreatedAt = DateTime.Now,
                    LoginIPAddress = login.SignupIPAddress,
                };
                _context.LoginCheckSandeepGupta.Add(failedLogin);
                await _context.SaveChangesAsync();

                return Unauthorized("Invalid username or password");
            }

            // Successful login
            UserID = user.UserId;
            Username = user.Username;

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, user.UserId.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(1),
                //Claims = new Dictionary<string, object>
                //     {
                //         { "exp", DateTime.UtcNow.AddMinutes(30).ToString() }
                //     },

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Issuer"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Log successful login attempt
            var loginCheck = new LoginCheck
            {
                UserId = user.UserId,
                IsValid = "True",
                CreatedAt = DateTime.Now,
                LoginIPAddress = login.SignupIPAddress,
            };
            _context.LoginCheckSandeepGupta.Add(loginCheck);
            await _context.SaveChangesAsync();

            return Ok(new { Token = tokenHandler.WriteToken(token), UserID, Username });
        }


        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersAuthenticationSandeep()
        {
            return await _context.UsersAuthenticationSandeep.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.UsersAuthenticationSandeep.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.UsersAuthenticationSandeep.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.UsersAuthenticationSandeep.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.UsersAuthenticationSandeep.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.UsersAuthenticationSandeep.Any(e => e.UserId == id);
        }
    }
}
