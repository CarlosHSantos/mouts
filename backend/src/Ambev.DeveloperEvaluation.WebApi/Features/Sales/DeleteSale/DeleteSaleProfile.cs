using Ambev.DeveloperEvaluation.Application.Sales.DeleteSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.DeleteSale;
using AutoMapper;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Users.CreateUser
{
    /// <summary>
    /// AutoMapper profile for mapping between Application and API layers
    /// related to the DeleteSale feature.
    /// </summary>
    public class DeleteSaleProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DeleteSaleProfile"/> class
        /// and configures the mapping definitions for DeleteSale related objects.
        /// </summary>
        public DeleteSaleProfile()
        {
            CreateMap<DeleteSaleRequest, DeleteSaleCommand>();
            CreateMap<Guid, DeleteSaleCommand>()
                .ConstructUsing(guid => new DeleteSaleCommand { Id = guid });
        }
    }
}
