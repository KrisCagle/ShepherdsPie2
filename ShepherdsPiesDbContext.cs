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
            
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.IdentityUser)
                .WithMany()
                .HasForeignKey(e => e.IdentityUserId);
    
        modelBuilder.Entity<Size>().HasData(
    new Size { SizeId = 1, Name = "Small (10\")", Price = 10.00m },
    new Size { SizeId = 2, Name = "Medium (14\")", Price = 12.00m },
    new Size { SizeId = 3, Name = "Large (18\")", Price = 15.00m }
);

modelBuilder.Entity<Cheese>().HasData(
    new Cheese { CheeseId = 1, Name = "Buffalo Mozzarella" },
    new Cheese { CheeseId = 2, Name = "Four Cheese" },
    new Cheese { CheeseId = 3, Name = "Vegan" },
    new Cheese { CheeseId = 4, Name = "None" }
);

modelBuilder.Entity<Sauce>().HasData(
    new Sauce { SauceId = 1, Name = "Marinara" },
    new Sauce { SauceId = 2, Name = "Arrabbiata" },
    new Sauce { SauceId = 3, Name = "Garlic White" },
    new Sauce { SauceId = 4, Name = "None" }
);

modelBuilder.Entity<Topping>().HasData(
    new Topping { ToppingId = 1, Name = "Sausage", Price = 0.50m },
    new Topping { ToppingId = 2, Name = "Pepperoni", Price = 0.50m },
    new Topping { ToppingId = 3, Name = "Mushroom", Price = 0.50m },
    new Topping { ToppingId = 4, Name = "Onion", Price = 0.50m },
    new Topping { ToppingId = 5, Name = "Green Pepper", Price = 0.50m },
    new Topping { ToppingId = 6, Name = "Black Olive", Price = 0.50m },
    new Topping { ToppingId = 7, Name = "Basil", Price = 0.50m },
    new Topping { ToppingId = 8, Name = "Extra Cheese", Price = 0.50m }
);
    
        }
        
    }


}