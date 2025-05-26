using System;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSale
{
    /// <summary>
    /// Represents the request to get the details of a sale by its unique identifier.
    /// </summary>
    public class GetSaleRequest
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale to retrieve.
        /// </summary>
        public Guid Id { get; set; }
    }
}
