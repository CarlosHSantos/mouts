using Ambev.DeveloperEvaluation.Application.Sales.CreateSale;
using Ambev.DeveloperEvaluation.Application.Sales.UpdateSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.UpdateSale;
using AutoMapper;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Users.CreateUser
{
    /// <summary>
    /// Profile for mapping between Application and API UpdateSale requests and responses.
    /// </summary>
    public class UpdateSaleProfile : Profile
    {
        /// <summary>
        /// Initializes the mappings for the UpdateSale feature.
        /// </summary>
        public UpdateSaleProfile()
        {
            CreateMap<UpdateSaleRequest, UpdateSaleCommand>();
            CreateMap<UpdateSaleResult, UpdateSaleResponse>();
            CreateMap<SaleItemDto, SaleItem>();
            CreateMap<UpdateSaleItemDto, UpdateSaleProductCommand>();
            CreateMap<Sale, UpdateSaleResponse>();
            CreateMap<Sale, UpdateSaleResult>();
            CreateMap<UpdateSaleProductCommand, SaleItem>();
            CreateMap<UpdateSaleItemDto, SaleItem>();
            CreateMap<UpdateSaleCommand, Sale>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products))
                .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
                .ForMember(dest => dest.IsCancelled, opt => opt.Ignore());
        }
    }
}
