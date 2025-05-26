namespace Ambev.DeveloperEvaluation.Application.Sales.Events
{
    /// <summary>
    /// Event triggered when a new sale is created.
    /// </summary>
    /// <param name="SaleId">Unique identifier of the sale.</param>
    /// <param name="Customer">Name of the customer.</param>
    /// <param name="TotalAmount">Total amount of the sale.</param>
    /// <param name="SaleDate">Date of the sale.</param>
    public record SaleCreatedEvent(Guid SaleId, string Customer, decimal TotalAmount, DateTime SaleDate);

    /// <summary>
    /// Event triggered when a sale is modified.
    /// </summary>
    /// <param name="SaleId">Unique identifier of the sale.</param>
    /// <param name="ModifiedAt">Date and time when the sale was modified.</param>
    public record SaleModifiedEvent(Guid SaleId, DateTime ModifiedAt);

    /// <summary>
    /// Event triggered when a sale is cancelled.
    /// </summary>
    /// <param name="SaleId">Unique identifier of the sale.</param>
    /// <param name="Reason">Reason for the cancellation.</param>
    public record SaleCancelledEvent(Guid SaleId, string Reason);

    /// <summary>
    /// Event triggered when an item in the sale is cancelled.
    /// </summary>
    /// <param name="ItemId">Unique identifier of the item.</param>
    /// <param name="SaleId">Unique identifier of the sale.</param>
    /// <param name="ProductName">Name of the cancelled product.</param>
    public record ItemCancelledEvent(Guid ItemId, Guid SaleId, string ProductName);
}
