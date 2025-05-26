using Ambev.DeveloperEvaluation.WebApi.Features.Sales.DeleteSale;
using AutoMapper;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSales
{
    /// <summary>
    /// AutoMapper profile for mapping between Application and API layers
    /// related to the GetAllSales feature.
    /// </summary>
    public class GetAllSalesProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetAllSalesProfile"/> class
        /// and configures the mapping definitions for GetAllSales related objects.
        /// </summary>
        public GetAllSalesProfile()
        {
            CreateMap<Sale, GetAllSalesResponse>()
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount));

            CreateMap<SaleItem, GetSaleItemResponse>();
            CreateMap<GetAllSalesRequest, GetAllSalesQuery>();
            CreateMap<Sale, GetAllSalesResult>();
            CreateMap<SaleItem, GetSaleItemResult>();
            CreateMap<GetAllSalesResult, GetAllSalesResponse>();
            CreateMap<GetSaleItemResult, GetSaleItemResponse>();
        }
    }
}
