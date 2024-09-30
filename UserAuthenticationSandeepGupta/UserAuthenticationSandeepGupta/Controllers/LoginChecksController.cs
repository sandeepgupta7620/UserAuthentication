using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserAuthenticationSandeepGupta.Models;

namespace UserAuthenticationSandeepGupta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginChecksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoginChecksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/LoginChecks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoginCheck>>> GetLoginCheckSandeepGupta()
        {
            return await _context.LoginCheckSandeepGupta.ToListAsync();
        }

        // GET: api/LoginChecks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoginCheck>> GetLoginCheck(int id)
        {
            var loginCheck = await _context.LoginCheckSandeepGupta.FindAsync(id);

            if (loginCheck == null)
            {
                return NotFound();
            }

            return loginCheck;
        }

        // PUT: api/LoginChecks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoginCheck(int id, LoginCheck loginCheck)
        {
            if (id != loginCheck.LoginId)
            {
                return BadRequest();
            }

            _context.Entry(loginCheck).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginCheckExists(id))
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

        // POST: api/LoginChecks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LoginCheck>> PostLoginCheck(LoginCheck loginCheck)
        {
            _context.LoginCheckSandeepGupta.Add(loginCheck);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoginCheck", new { id = loginCheck.LoginId }, loginCheck);
        }

        // DELETE: api/LoginChecks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoginCheck(int id)
        {
            var loginCheck = await _context.LoginCheckSandeepGupta.FindAsync(id);
            if (loginCheck == null)
            {
                return NotFound();
            }

            _context.LoginCheckSandeepGupta.Remove(loginCheck);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoginCheckExists(int id)
        {
            return _context.LoginCheckSandeepGupta.Any(e => e.LoginId == id);
        }

        [HttpGet("user-logins/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<LoginCheck>>> GetUserLoginRecords(int userId)
        {
            //var userLogins = await _context.LoginCheckSandeepGupta
            //                              .Where(l => l.UserId == userId)
            //                              .ToListAsync();
            var userLogins = await _context.LoginCheckSandeepGupta
                              .Where(l => l.UserId == userId)
                              .OrderByDescending(l => l.CreatedAt) // Sort by CreatedAt in descending order
                              .ToListAsync();

            if (userLogins == null || !userLogins.Any())
            {
                return NotFound($"No records found for userId {userId}");
            }

            return Ok(userLogins);
        }

    }
}

    

