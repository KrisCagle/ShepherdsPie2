using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShepherdsPies.Models;

namespace ShepherdsPies.Data
{
    public class ShepherdsPiesDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Pizza> Pizzas { get; set; }
        public DbSet<PizzaTopping> PizzaToppings { get; set; }
        public DbSet<Cheese> Cheeses { get; set; }
        public DbSet<Sauce> Sauces { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Topping> Toppings { get; set; }

        public ShepherdsPiesDbContext(DbContextOptions<ShepherdsPiesDbContext> context) : base(context)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // required for Identity tables to be configured

            modelBuilder.Entity<Order>()
                .HasOne(o => o.OrderTakenBy)
                .WithMany()
                .HasForeignKey(o => o.OrderTakenByEmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.DeliveryEmployee)
                .WithMany()
                .HasForeignKey(o => o.DeliveryEmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pizza>()
                .HasOne(p => p.Order)
                .WithMany(o => o.Pizzas)
                .HasForeignKey(p => p.OrderId);

            modelBuilder.Entity<Pizza>()
                .HasOne(p => p.Cheese)
                .WithMany()
                .HasForeignKey(p => p.CheeseId);

            modelBuilder.Entity<Pizza>()
                .HasOne(p => p.Sauce)
                .WithMany()
                .HasForeignKey(p => p.SauceId);

            modelBuilder.Entity<Pizza>()
                .HasOne(p => p.Size)
                .WithMany()
                .HasForeignKey(p => p.SizeId);

            modelBuilder.Entity<PizzaTopping>()
                .HasOne(pt => pt.Pizza)
                .WithMany(p => p.PizzaToppings)
                .HasForeignKey(pt => pt.PizzaId);

            modelBuilder.Entity<PizzaTopping>()
                .HasOne(pt => pt.Topping)
                .WithMany()
                .HasForeignKey(pt => pt.ToppingId);
        }
    }
}