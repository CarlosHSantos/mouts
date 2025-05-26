using AutoMapper;
using MediatR;
using Ambev.DeveloperEvaluation.Domain.Repositories;

namespace Ambev.DeveloperEvaluation.Application.Sales.GetSaleById;

/// <summary>
/// Handler for the GetSaleByIdQuery to retrieve sale details by its identifier.
/// </summary>
public class GetSaleByIdHandler : IRequestHandler<GetSaleByIdQuery, GetSaleByIdResult>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetSaleByIdHandler"/> class.
    /// </summary>
    /// <param name="saleRepository">Repository for accessing sale data.</param>
    /// <param name="mapper">Mapper for entity-to-DTO conversions.</param>
    public GetSaleByIdHandler(ISaleRepository saleRepository, IMapper mapper)
    {
        _saleRepository = saleRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the query to get sale details by ID.
    /// </summary>
    /// <param name="request">The query containing the sale ID.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation, containing the sale details.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when the sale with the specified ID does not exist.</exception>
    public async Task<GetSaleByIdResult> Handle(GetSaleByIdQuery request, CancellationToken cancellationToken)
    {
        var sale = await _saleRepository.GetByIdAsync(request.Id, cancellationToken);
        if (sale == null)
            throw new KeyNotFoundException("Sale not found");

        return new GetSaleByIdResult
        {
            Id = sale.Id,
            SaleNumber = sale.SaleNumber,
            SaleDate = sale.SaleDate,
            Customer = sale.Customer,
            Branch = sale.Branch,
            TotalAmount = sale.TotalAmount,
            IsCancelled = sale.IsCancelled,
            Products = sale.Products.Select(i => new GetSaleItemDto
            {
                Id = i.Id,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Discount = i.Discount,
                Total = i.Total
            }).ToList()
        };
    }
}
