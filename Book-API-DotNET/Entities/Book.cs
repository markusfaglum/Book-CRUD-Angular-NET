namespace Book_API_DotNET.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string PublishingDate { get; set; } = string.Empty;
    }
}
