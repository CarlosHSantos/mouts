namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale
{
    /// <summary>
    /// Represents a request to create a new sale, including sale details and products.
    /// </summary>
    public class CreateSaleRequest
    {
        /// <summary>
        /// Gets or sets the date when the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Gets or sets the sale number or code used for identification.
        /// </summary>
        public string SaleNumber { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the customer's display name (denormalized).
        /// </summary>
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the branch name (denormalized).
        /// </summary>
        public string Branch { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the list of products involved in the sale.
        /// </summary>
        public List<CreateSaleItemDto> Products { get; set; } = new();
    }

    /// <summary>
    /// Represents an item within a sale, including product details and quantity.
    /// </summary>
    public class CreateSaleItemDto
    {
        /// <summary>
        /// Gets or sets the name of the product.
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the quantity of the product being sold.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Gets or sets the unit price of the product.
        /// </summary>
        public decimal UnitPrice { get; set; }
    }
}
