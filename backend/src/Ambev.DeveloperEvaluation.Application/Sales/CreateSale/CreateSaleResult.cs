namespace Ambev.DeveloperEvaluation.Application.Sales.CreateSale
{
    /// <summary>
    /// Represents the result of a successful sale creation.
    /// Contains the unique identifier of the sale, its sale number, and the total amount.
    /// </summary>
    public class CreateSaleResult
    {
        /// <summary>
        /// Gets or sets the unique identifier of the created sale.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the sale number or code used for identification.
        /// </summary>
        public string SaleNumber { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the total amount of the sale.
        /// </summary>
        public decimal TotalAmount { get; set; }
    }
}
