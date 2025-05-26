using System;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale
{
    /// <summary>
    /// Represents the response returned after successfully creating a sale.
    /// </summary>
    public class CreateSaleResponse
    {
        /// <summary>
        /// Gets or sets the unique identifier of the created sale.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the date when the sale occurred.
        /// </summary>
        public DateTime SaleDate { get; set; }

        /// <summary>
        /// Gets or sets the total monetary amount of the sale.
        /// </summary>
        public decimal TotalAmount { get; set; }
    }
}
