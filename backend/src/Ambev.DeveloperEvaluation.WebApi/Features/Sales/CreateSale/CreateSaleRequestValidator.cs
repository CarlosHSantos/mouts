using FluentValidation;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale
{
    /// <summary>
    /// Validator for <see cref="CreateSaleRequest"/> to ensure the request data is valid.
    /// </summary>
    public class CreateSaleRequestValidator : AbstractValidator<CreateSaleRequest>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateSaleRequestValidator"/> class
        /// and defines validation rules for the sale creation request.
        /// </summary>
        public CreateSaleRequestValidator()
        {
            RuleFor(x => x.SaleDate).NotEmpty();
            RuleFor(x => x.SaleNumber).NotEmpty();
            RuleFor(x => x.Customer).NotEmpty();
            RuleForEach(x => x.Products).SetValidator(new CreateSaleItemDtoValidator());
        }
    }

    /// <summary>
    /// Validator for <see cref="CreateSaleItemDto"/> to ensure each sale item is valid.
    /// </summary>
    public class CreateSaleItemDtoValidator : AbstractValidator<CreateSaleItemDto>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateSaleItemDtoValidator"/> class
        /// and defines validation rules for each sale item.
        /// </summary>
        public CreateSaleItemDtoValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.UnitPrice).GreaterThan(0);
        }
    }
}
