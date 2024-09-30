using Microsoft.EntityFrameworkCore;

namespace UserAuthenticationSandeepGupta.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<User> UsersAuthenticationSandeep { get; set; }
        public DbSet<LoginCheck> LoginCheckSandeepGupta { get; set; }
    }
}
