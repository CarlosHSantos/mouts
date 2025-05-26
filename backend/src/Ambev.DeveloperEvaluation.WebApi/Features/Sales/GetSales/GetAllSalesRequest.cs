using System;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSales
{
    /// <summary>
    /// Represents the request parameters for retrieving a paginated list of sales.
    /// </summary>
    public class GetAllSalesRequest
    {
        /// <summary>
        /// Gets or sets the page number to retrieve. Default is 1.
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// Gets or sets the number of sales to retrieve per page. Default is 10.
        /// </summary>
        public int PageSize { get; set; } = 10;
    }
}
