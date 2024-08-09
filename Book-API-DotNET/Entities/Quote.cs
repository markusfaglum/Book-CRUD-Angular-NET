namespace Book_API_DotNET.Entities
{
    public class Quote
    {
        public int Id { get; set; }
        public required string Quotation { get; set; }
        public string Attributed { get; set; } = string.Empty;
        public string DateOfQuote { get; set; } = string.Empty;
    }
}
