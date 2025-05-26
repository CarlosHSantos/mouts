using Ambev.DeveloperEvaluation.Application.Sales.DeleteSale;
using Ambev.DeveloperEvaluation.Application.Sales.GetSaleById;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSale;
using AutoMapper;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Users.CreateUser
{
    /// <summary>
    /// AutoMapper profile for mapping between Application and API layers
    /// related to the GetSale feature.
    /// </summary>
    public class GetSaleProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetSaleProfile"/> class
        /// and configures the mapping definitions for GetSale related objects.
        /// </summary>
        public GetSaleProfile()
        {
            CreateMap<GetSaleRequest, GetSaleRequest>();
            CreateMap<GetSaleResponse, GetSaleResponse>();
            CreateMap<Sale, GetSaleByIdResult>();
            CreateMap<GetSaleByIdResult, GetSaleResponse>();
            CreateMap<GetSaleItemDto, SaleItemDto>();
            CreateMap<Guid, GetSaleByIdQuery>()
                .ConstructUsing(guid => new GetSaleByIdQuery { Id = guid });
        }
    }
}
