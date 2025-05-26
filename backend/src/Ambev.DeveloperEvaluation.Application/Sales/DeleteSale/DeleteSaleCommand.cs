using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Sales.DeleteSale
{
    /// <summary>
    /// Command to request the deletion of a sale by its unique identifier.
    /// </summary>
    public class DeleteSaleCommand : IRequest<DeleteSaleResponse>
    {
        /// <summary>
        /// Gets or sets the unique identifier of the sale to be deleted.
        /// </summary>
        public Guid Id { get; set; }
    }
}
