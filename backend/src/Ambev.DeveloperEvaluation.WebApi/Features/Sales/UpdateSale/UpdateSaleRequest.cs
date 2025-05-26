using Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale;
using System;
using System.Collections.Generic;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.UpdateSale
{
    /// <summary>
    /// Request model for updating a sale.
    /// </summary>
    public class UpdateSaleRequest
    {
        /// <summary>
        /// Unique identifier of the sale.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Date when the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Sale number or code used for identification.
        /// </summary>
        public string SaleNumber { get; set; } = string.Empty;

        /// <summary>
        /// Customer's display name (denormalized).
        /// </summary>
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Branch name (denormalized).
        /// </summary>
        public string Branch { get; set; } = string.Empty;

        /// <summary>
        /// List of products/items in the sale.
        /// </summary>
        public List<UpdateSaleItemDto> Products { get; set; } = new();

        /// <summary>
        /// Indicates if the sale has been cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }

    /// <summary>
    /// DTO representing an item/product within an update sale request.
    /// </summary>
    public class UpdateSaleItemDto
    {
        /// <summary>
        /// Unique identifier of the sale item.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Name of the product.
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Quantity of the product sold.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// Unit price of the product.
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Indicates if the sale item has been cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }
}
