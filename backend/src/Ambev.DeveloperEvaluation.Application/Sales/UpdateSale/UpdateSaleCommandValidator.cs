using FluentValidation;

namespace Ambev.DeveloperEvaluation.Application.Sales.UpdateSale
{
    /// <summary>
    /// Validator for the <see cref="UpdateSaleCommand"/> class.
    /// Validates the sale update request.
    /// </summary>
    public class UpdateSaleCommandValidator : AbstractValidator<UpdateSaleCommand>
    {
        public UpdateSaleCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Sale ID must be provided.");
            RuleFor(x => x.SaleNumber).NotEmpty().WithMessage("Sale number must be provided.");
            RuleFor(x => x.Customer).NotEmpty().WithMessage("Customer name must be provided.");
            RuleFor(x => x.Branch).NotEmpty().WithMessage("Branch name must be provided.");
            RuleForEach(x => x.Products).SetValidator(new UpdateSaleItemDtoValidator());
        }
    }

    /// <summary>
    /// Validator for the <see cref="UpdateSaleProductCommand"/> class.
    /// Validates each product item in the sale update request.
    /// </summary>
    public class UpdateSaleItemDtoValidator : AbstractValidator<UpdateSaleProductCommand>
    {
        public UpdateSaleItemDtoValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty().WithMessage("Product name must be provided.");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
            RuleFor(x => x.UnitPrice).GreaterThan(0).WithMessage("Unit price must be greater than zero.");
            RuleFor(x => x.Discount).GreaterThanOrEqualTo(0).WithMessage("Discount cannot be negative.");
            RuleFor(x => x.Quantity)
                .LessThanOrEqualTo(20)
                .WithMessage(p => $"Cannot sell more than 20 units of product '{p.ProductName}'.");
        }
    }
}
