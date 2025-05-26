using Ambev.DeveloperEvaluation.Application.Sales.CreateSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale;
using AutoMapper;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Users.CreateUser
{
    /// <summary>
    /// AutoMapper profile for mapping between Application layer and API layer
    /// models related to the CreateSale feature.
    /// </summary>
    public class CreateSaleProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateSaleProfile"/> class
        /// and configures the mapping definitions for CreateSale related DTOs and domain models.
        /// </summary>
        public CreateSaleProfile()
        {
            CreateMap<CreateSaleItemDto, SaleItemDto>();
            CreateMap<CreateSaleRequest, CreateSaleCommand>();
            CreateMap<CreateSaleResult, CreateSaleResponse>();
            CreateMap<SaleItemDto, SaleItem>();
            CreateMap<Sale, CreateSaleResult>();
            CreateMap<CreateSaleCommand, Sale>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products))
                .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
                .ForMember(dest => dest.IsCancelled, opt => opt.Ignore());
        }
    }
}
