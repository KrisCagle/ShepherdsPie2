namespace ShepherdsPies.Models;

public class PizzaTopping
{
    public int PizzaToppingId { get; set; }

    public int PizzaId { get; set; }
    public Pizza Pizza { get; set; }

    public int ToppingId { get; set; }
    public Topping Topping { get; set; }
}