using DotNetCore_Auth.Models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCore_Auth.Context
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> appDbContext):base(appDbContext)
        {
                
        }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
        }
    }
}
