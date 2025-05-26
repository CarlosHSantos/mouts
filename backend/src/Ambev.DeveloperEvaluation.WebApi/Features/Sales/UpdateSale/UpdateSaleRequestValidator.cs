using FluentValidation;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.UpdateSale
{
    /// <summary>
    /// Validator for <see cref="UpdateSaleRequest"/>.
    /// Ensures that required properties are set and valid.
    /// </summary>
    public class UpdateSaleRequestValidator : AbstractValidator<UpdateSaleRequest>
    {
        /// <summary>
        /// Initializes validation rules for <see cref="UpdateSaleRequest"/>.
        /// </summary>
        public UpdateSaleRequestValidator()
        {
            RuleFor(x => x.SaleDate).NotEmpty();
            RuleFor(x => x.SaleNumber).NotEmpty();
            RuleFor(x => x.Customer).NotEmpty();
            RuleForEach(x => x.Products).SetValidator(new UpdateSaleItemDtoValidator());
        }
    }

    /// <summary>
    /// Validator for <see cref="UpdateSaleItemDto"/>.
    /// Validates individual sale items within the update request.
    /// </summary>
    public class UpdateSaleItemDtoValidator : AbstractValidator<UpdateSaleItemDto>
    {
        /// <summary>
        /// Initializes validation rules for <see cref="UpdateSaleItemDto"/>.
        /// </summary>
        public UpdateSaleItemDtoValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.UnitPrice).GreaterThan(0);
        }
    }
}
