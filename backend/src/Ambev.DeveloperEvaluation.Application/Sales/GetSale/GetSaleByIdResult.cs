namespace Ambev.DeveloperEvaluation.Application.Sales.GetSaleById
{
    /// <summary>
    /// Result data returned when retrieving a sale by ID.
    /// </summary>
    public class GetSaleByIdResult
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the sale number or code.
        /// </summary>
        public string SaleNumber { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Gets or sets the customer name (denormalized).
        /// </summary>
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the branch name (denormalized).
        /// </summary>
        public string Branch { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the total amount of the sale.
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the sale is cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }

        /// <summary>
        /// Gets or sets the list of sale items/products.
        /// </summary>
        public List<GetSaleItemDto> Products { get; set; } = new();
    }

    /// <summary>
    /// Data transfer object representing an item/product within a sale.
    /// </summary>
    public class GetSaleItemDto
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale item.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the product name.
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the quantity of the product sold.
        /// </summary>
        public decimal Quantity { get; set; }

        /// <summary>
        /// Gets or sets the unit price of the product.
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Gets or sets the discount applied to the product.
        /// </summary>
        public decimal Discount { get; set; }

        /// <summary>
        /// Gets or sets the total amount for the product (Quantity * UnitPrice - Discount).
        /// </summary>
        public decimal Total { get; set; }
    }
}
