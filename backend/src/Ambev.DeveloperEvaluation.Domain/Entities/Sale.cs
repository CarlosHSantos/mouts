/// <summary>
/// Represents a sales transaction.
/// </summary>
public class Sale
{
    /// <summary>
    /// Unique identifier for the sale.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Sale number or code used for identification.
    /// </summary>
    public string SaleNumber { get; set; } = string.Empty;

    /// <summary>
    /// Date and time when the sale was made.
    /// </summary>
    public DateTime SaleDate { get; set; }

    /// <summary>
    /// Customer's display name (denormalized).
    /// </summary>
    public string Customer { get; set; } = string.Empty;

    /// <summary>
    /// Branch name (denormalized).
    /// </summary>
    public string Branch { get; set; } = string.Empty;

    /// <summary>
    /// List of Products sold in the transaction.
    /// </summary>
    public List<SaleItem> Products { get; set; } = new();

    /// <summary>
    /// Total amount of the sale, calculated from Products.
    /// </summary>
    public decimal TotalAmount => Products.Sum(i => i.Total);

    /// <summary>
    /// Indicates whether the sale was cancelled.
    /// </summary>
    public bool IsCancelled { get; set; }

    public void ApplyDiscountRules()
    {
        foreach (var item in Products)
        {
            item.ApplyDiscount();
        }
    }
}
