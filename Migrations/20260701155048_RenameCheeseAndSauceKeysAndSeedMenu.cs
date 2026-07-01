using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShepherdsPies.Migrations
{
    /// <inheritdoc />
    public partial class RenameCheeseAndSauceKeysAndSeedMenu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Sauces",
                newName: "SauceId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Cheeses",
                newName: "CheeseId");

            migrationBuilder.InsertData(
                table: "Cheeses",
                columns: new[] { "CheeseId", "Name" },
                values: new object[,]
                {
                    { 1, "Buffalo Mozzarella" },
                    { 2, "Four Cheese" },
                    { 3, "Vegan" },
                    { 4, "None" }
                });

            migrationBuilder.InsertData(
                table: "Sauces",
                columns: new[] { "SauceId", "Name" },
                values: new object[,]
                {
                    { 1, "Marinara" },
                    { 2, "Arrabbiata" },
                    { 3, "Garlic White" },
                    { 4, "None" }
                });

            migrationBuilder.InsertData(
                table: "Sizes",
                columns: new[] { "SizeId", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Small (10\")", 10.00m },
                    { 2, "Medium (14\")", 12.00m },
                    { 3, "Large (18\")", 15.00m }
                });

            migrationBuilder.InsertData(
                table: "Toppings",
                columns: new[] { "ToppingId", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Sausage", 0.50m },
                    { 2, "Pepperoni", 0.50m },
                    { 3, "Mushroom", 0.50m },
                    { 4, "Onion", 0.50m },
                    { 5, "Green Pepper", 0.50m },
                    { 6, "Black Olive", 0.50m },
                    { 7, "Basil", 0.50m },
                    { 8, "Extra Cheese", 0.50m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Cheeses",
                keyColumn: "CheeseId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Cheeses",
                keyColumn: "CheeseId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Cheeses",
                keyColumn: "CheeseId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Cheeses",
                keyColumn: "CheeseId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Sauces",
                keyColumn: "SauceId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Sauces",
                keyColumn: "SauceId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Sauces",
                keyColumn: "SauceId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Sauces",
                keyColumn: "SauceId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Sizes",
                keyColumn: "SizeId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Sizes",
                keyColumn: "SizeId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Sizes",
                keyColumn: "SizeId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Toppings",
                keyColumn: "ToppingId",
                keyValue: 8);

            migrationBuilder.RenameColumn(
                name: "SauceId",
                table: "Sauces",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CheeseId",
                table: "Cheeses",
                newName: "id");
        }
    }
}
