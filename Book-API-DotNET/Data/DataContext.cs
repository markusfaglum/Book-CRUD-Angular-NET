using Book_API_DotNET.Entities;
using Microsoft.EntityFrameworkCore;

namespace Book_API_DotNET.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext>options) : base(options)
        {
            
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
