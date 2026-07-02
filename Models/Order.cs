namespace ShepherdsPies.Models;

public class Order
{
    public int OrderId { get; set; }
    public int? TableNumber { get; set; }

    public int OrderTakenByEmployeeId { get; set; }
    public Employee OrderTakenBy { get; set; }

    public int? DeliveryEmployeeId { get; set; }
    public Employee DeliveryEmployee { get; set; }

    public decimal? TipAmount { get; set; }
    public DateTime OrderDate { get; set; }

    public List<Pizza> Pizzas { get; set; }
}