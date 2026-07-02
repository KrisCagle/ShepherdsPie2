# ShepherdsPie2
# Shepherd's Pies

An order management system for Giuseppe "Joe" Shepherd's pizza restaurant. Employees can log in to create orders (dine-in or delivery), build out pizzas with custom cheese, sauce, size, and toppings, assign a delivery employee, and manage orders in real time.

Built as a capstone project for Nashville Software School.

## Tech stack

**Backend**
- ASP.NET Core (.NET 10)
- Entity Framework Core with Npgsql (PostgreSQL)
- ASP.NET Core Identity (cookie-based authentication)
- AutoMapper
- Swagger / Swashbuckle

**Frontend**
- React (Vite)
- React Router

**Database**
- PostgreSQL

## Features

- Employee registration and login (cookie session auth)
- Create an order for a table or for delivery
- View all orders, filtered by day (defaults to today), newest first
- View full order details, including pizzas, toppings, and running total
- Add a pizza to an order, choosing size, cheese, and sauce
- Edit an existing pizza's size, cheese, or sauce
- Add or remove toppings on a pizza
- Remove a pizza from an order
- Assign an employee as the delivery driver for an order
- Cancel (delete) an order
- Total cost is calculated live from pizza size, topping count, and a $5.00 delivery surcharge — never stored, so it can't go stale as an order changes

## Data model

Core entities: `Employee`, `Order`, `Pizza`, `PizzaTopping`, `Size`, `Cheese`, `Sauce`, `Topping`.

The trickiest relationship is `Order`, which references `Employee` twice for two different purposes:

- `OrderTakenByEmployeeId` — required. The employee who took the order.
- `DeliveryEmployeeId` — nullable. Set only if the order is for delivery; this doubles as the flag that distinguishes a delivery order from a dine-in order (if it's set, `TableNumber` is cleared).

Since both foreign keys point at the same `Employee` table, EF Core can't infer them by convention — they're configured explicitly in `ShepherdsPiesDbContext.OnModelCreating` with two separate `HasOne().WithMany().HasForeignKey()` calls, each set to `DeleteBehavior.Restrict` (required whenever two FKs target the same table, to avoid SQL Server/Postgres rejecting the migration over ambiguous cascade paths).

`Pizza` connects to `Order`, `Size`, `Cheese`, and `Sauce`. Toppings are a many-to-many relationship between `Pizza` and `Topping`, resolved through the `PizzaTopping` join table, since a pizza can have any number of toppings.

`Employee` also has an `IdentityUserId` foreign key linking it to ASP.NET Identity's `IdentityUser`, so a logged-in session can be resolved to "the employee who's currently logged in."

## Getting started

### Prerequisites

- .NET 10 SDK
- Node.js
- PostgreSQL, running locally

### Backend setup

1. From the project root, create `appsettings.json` (not committed) with your local connection string:

```json
   {
     "ShepherdsPiesDbConnectionString": "Host=localhost;Port=5432;Database=ShepherdsPies;Username=postgres;Password=YOUR_PASSWORD",
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning"
       }
     },
     "AllowedHosts": "*"
   }
```

2. Restore and apply migrations, which creates the database (including seeded menu data — sizes, cheeses, sauces, and toppings matching Joe's menu):

```bash
   dotnet ef database update
```

3. Run the API:

```bash
   ASPNETCORE_ENVIRONMENT=Development dotnet run
```

   Swagger UI is available at `http://localhost:5000/swagger` in development.

### Frontend setup

From the `client` folder:

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend on `http://localhost:5000` (configured in `vite.config.js`).

Register a new employee account through the app to get started — every registered user is treated as an employee, since only employees use this system.

## API overview

| Endpoint | Description |
|---|---|
| `POST /api/account/register` | Create an employee account and log in |
| `POST /api/account/login` | Log in |
| `POST /api/account/logout` | Log out |
| `GET /api/account/me` | Get the currently logged-in employee |
| `GET /api/employees` | List all employees |
| `GET /api/employees/{id}` | Get a single employee |
| `GET /api/orders?date=YYYY-MM-DD` | List orders for a given day (defaults to today) |
| `GET /api/orders/{id}` | Get order details, including pizzas and toppings |
| `POST /api/orders` | Create an order |
| `PUT /api/orders/{id}/delivery` | Assign a delivery employee to an order |
| `DELETE /api/orders/{id}` | Cancel (delete) an order |
| `POST /api/pizza` | Add a pizza to an order |
| `GET /api/pizza/{id}` | Get a single pizza |
| `PUT /api/pizza/{id}` | Update a pizza's size, cheese, or sauce |
| `DELETE /api/pizza/{id}` | Remove a pizza from an order |
| `POST /api/pizza/{id}/toppings` | Add a topping to a pizza |
| `DELETE /api/pizza/{pizzaId}/toppings/{toppingId}` | Remove a topping from a pizza |
| `GET /api/menu/sizes` `/cheeses` `/sauces` `/toppings` | Menu lookup data |

All endpoints except `register` and `login` require an authenticated session.

## Known limitations / possible future work

- No way to un-assign a delivery employee once one is set
- No employee-level roles or permissions — any logged-in employee can perform any action
- No tip entry from the UI yet (the field exists on the model but isn't editable through a form)
- No automated tests