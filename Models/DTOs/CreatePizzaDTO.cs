namespace ShepherdsPies.Models.DTOs
{
    public class CreatePizzaDTO
    {
        public int OrderId { get; set; }
        public int SizeId { get; set; }
        public int CheeseId { get; set; }
        public int SauceId { get; set; }
    }
}