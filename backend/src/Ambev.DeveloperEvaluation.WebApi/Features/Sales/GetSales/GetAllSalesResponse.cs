using System;
using System.Collections.Generic;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSales
{
    /// <summary>
    /// Represents the response data for a single sale in the list of all sales.
    /// </summary>
    public class GetAllSalesResponse
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the sale number or code used for identification.
        /// </summary>
        public string SaleNumber { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date when the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Gets or sets the customer's display name (denormalized).
        /// </summary>
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the branch name (denormalized).
        /// </summary>
        public string Branch { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the list of products associated with the sale.
        /// </summary>
        public List<GetSaleItemResponse> Products { get; set; } = new();

        /// <summary>
        /// Gets or sets the total amount of the sale.
        /// </summary>
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the sale was cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }

    /// <summary>
    /// Represents an individual product item within a sale.
    /// </summary>
    public class GetSaleItemResponse
    {
        /// <summary>
        /// Gets or sets the unique identifier of the product.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the product.
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
        /// Gets or sets the total amount for this product (quantity * unit price - discount).
        /// </summary>
        public decimal Total { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the product was cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }
}
