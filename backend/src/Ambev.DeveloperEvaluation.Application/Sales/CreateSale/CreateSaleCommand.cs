using Ambev.DeveloperEvaluation.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace Ambev.DeveloperEvaluation.Application.Sales.CreateSale
{
    /// <summary>
    /// Command to create a new sale, containing the sale details and product items.
    /// </summary>
    public class CreateSaleCommand : IRequest<CreateSaleResult>
    {
        /// <summary>
        /// Gets or sets the date when the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Gets or sets the sale number or code used for identification.
        /// </summary>
        public string SaleNumber { get; set; }

        /// <summary>
        /// Gets or sets the customer's display name (denormalized).
        /// </summary>
        public string Customer { get; set; }

        /// <summary>
        /// Gets or sets the branch name where the sale occurred (denormalized).
        /// </summary>
        public string Branch { get; set; }

        /// <summary>
        /// Gets or sets the list of products included in the sale.
        /// </summary>
        public List<SaleItemDto> Products { get; set; }
    }

    /// <summary>
    /// Data transfer object representing an item in a sale.
    /// </summary>
    public class SaleItemDto
    {
        /// <summary>
        /// Gets or sets the product's name.
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
    }
}
