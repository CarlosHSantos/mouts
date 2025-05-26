using MediatR;
using AutoMapper;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ambev.DeveloperEvaluation.Domain.Repositories;

/// <summary>
/// Handles the query to get all sales.
/// </summary>
public class GetAllSalesQueryHandler : IRequestHandler<GetAllSalesQuery, List<GetAllSalesResult>>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injecting dependencies.
    /// </summary>
    /// <param name="saleRepository">Repository to access sales data</param>
    /// <param name="mapper">AutoMapper instance for mapping entities to DTOs</param>
    public GetAllSalesQueryHandler(ISaleRepository saleRepository, IMapper mapper)
    {
        _saleRepository = saleRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the GetAllSalesQuery request asynchronously.
    /// </summary>
    /// <param name="request">The query request containing any filter parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A list of sales mapped to GetAllSalesResult DTOs</returns>
    public async Task<List<GetAllSalesResult>> Handle(GetAllSalesQuery request, CancellationToken cancellationToken)
    {
        // Retrieve all sales from the repository
        var sales = await _saleRepository.GetAllAsync(cancellationToken);

        // Map domain entities to result DTOs and return
        return _mapper.Map<List<GetAllSalesResult>>(sales);
    }
}
