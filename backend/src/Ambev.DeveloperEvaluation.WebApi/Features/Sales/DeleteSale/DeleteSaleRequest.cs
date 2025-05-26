using System;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.DeleteSale
{
    /// <summary>
    /// Represents the request to delete a sale by its unique identifier.
    /// </summary>
    public class DeleteSaleRequest
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale to be deleted.
        /// </summary>
        public Guid Id { get; set; }
    }
}
