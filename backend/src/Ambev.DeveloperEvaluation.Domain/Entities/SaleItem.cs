/// <summary>
/// Represents an item included in a sale.
/// </summary>
public class SaleItem
{
    /// <summary>
    /// Unique identifier for the sale item.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Product name (denormalized).
    /// </summary>
    public string ProductName { get; set; } = string.Empty;

    /// <summary>
    /// Quantity of the product sold.
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Price per unit of the product.
    /// </summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Discount applied to the item.
    /// </summary>
    public decimal Discount { get; set; }

    /// <summary>
    /// Total value of the item (Quantity * UnitPrice - Discount).
    /// </summary>
    public decimal Total => (Quantity * UnitPrice) - Discount;

    /// <summary>
    /// Indicates whether the product sale was cancelled.
    /// </summary>
    public bool IsCancelled { get; set; }

    /// <summary>
    /// Unique identifier for the sale.
    /// </summary>
    public Guid SaleId { get; set; }

    public void ApplyDiscount()
    {
        if (Quantity > 20)
            throw new DomainException($"Cannot sell more than 20 units of product '{ProductName}'");

        if (Quantity >= 10)
            Discount = Quantity * UnitPrice * 0.20m;
        else if (Quantity >= 4)
            Discount = Quantity * UnitPrice * 0.10m;
        else
            Discount = 0;
    }
}
