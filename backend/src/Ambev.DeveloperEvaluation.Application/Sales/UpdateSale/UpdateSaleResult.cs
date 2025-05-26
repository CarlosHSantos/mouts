namespace Ambev.DeveloperEvaluation.Application.Sales.UpdateSale
{
    /// <summary>
    /// Represents the result of updating a sale.
    /// </summary>
    public class UpdateSaleResult
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the total amount of the sale after update.
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the sale was cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }
}
