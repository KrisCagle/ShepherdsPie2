public class Pizza
{
    public int id {get; set;}
    public int CheeseId  {get; set; }
    public int SauceId {get; set; }
    public List<Topping> Toppings {get; set;}
    public string Size {get; set; }
    public decimal Price {get; set; }
}