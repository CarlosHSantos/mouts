using MediatR;

namespace Ambev.DeveloperEvaluation.Application.Sales.GetSaleById;

/// <summary>
/// Query to get a sale by its unique identifier.
/// </summary>
public class GetSaleByIdQuery : IRequest<GetSaleByIdResult>
{
    /// <summary>
    /// Gets or sets the unique identifier of the sale to retrieve.
    /// </summary>
    public Guid Id { get; set; }
}
