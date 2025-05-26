using MediatR;
using System;
using System.Collections.Generic;

namespace Ambev.DeveloperEvaluation.Application.Sales.UpdateSale
{
    /// <summary>
    /// Command to update an existing sale.
    /// </summary>
    public class UpdateSaleCommand : IRequest<UpdateSaleResult>
    {
        /// <summary>
        /// Unique identifier of the sale to update.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Unique sale number or code.
        /// </summary>
        public string SaleNumber { get; set; } = string.Empty;

        /// <summary>
        /// Date when the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Customer name (denormalized for convenience).
        /// </summary>
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Branch name where the sale was made (denormalized).
        /// </summary>
        public string Branch { get; set; } = string.Empty;

        /// <summary>
        /// List of product items included in the sale.
        /// </summary>
        public List<UpdateSaleProductCommand> Products { get; set; } = new();

        /// <summary>
        /// Indicates whether the entire sale was cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }

    /// <summary>
    /// DTO representing an individual product item within a sale.
    /// </summary>
    public class UpdateSaleProductCommand
    {
        /// <summary>
        /// Unique identifier of the product item.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Name of the product sold.
        /// </summary>
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Quantity of the product sold.
        /// </summary>
        public decimal Quantity { get; set; }

        /// <summary>
        /// Unit price of the product.
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// Discount applied to this product item.
        /// </summary>
        public decimal Discount { get; set; }

        /// <summary>
        /// Indicates whether this product item sale was cancelled.
        /// </summary>
        public bool IsCancelled { get; set; }
    }
}
