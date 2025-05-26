using FluentValidation;
using System;

namespace Ambev.DeveloperEvaluation.Application.Sales.CreateSale
{
    /// <summary>
    /// Validator for the <see cref="CreateSaleCommand"/> class.
    /// Ensures that the sale date is not in the future, and that required fields are populated.
    /// </summary>
    public class CreateSaleCommandValidator : AbstractValidator<CreateSaleCommand>
    {
        public CreateSaleCommandValidator()
        {
            RuleFor(x => x.SaleDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("Sale date cannot be in the future.");

            RuleFor(x => x.SaleNumber)
                .NotEmpty()
                .WithMessage("Sale number must be provided.");

            RuleFor(x => x.Customer)
                .NotEmpty()
                .WithMessage("Customer must be provided.");

            RuleForEach(x => x.Products)
                .SetValidator(new CreateSaleItemValidator());
        }
    }

    /// <summary>
    /// Validator for the <see cref="SaleItemDto"/> class.
    /// Ensures product details are valid, such as non-empty names, positive quantities and prices,
    /// and limits the quantity sold per product.
    /// </summary>
    public class CreateSaleItemValidator : AbstractValidator<SaleItemDto>
    {
        public CreateSaleItemValidator()
        {
            RuleFor(x => x.ProductName)
                .NotEmpty()
                .WithMessage("Product name must be provided.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0)
                .WithMessage("Quantity must be greater than zero.");

            RuleFor(x => x.UnitPrice)
                .GreaterThan(0)
                .WithMessage("Unit price must be greater than zero.");

            RuleFor(x => x.Quantity)
                .LessThanOrEqualTo(20)
                .WithMessage(p => $"Cannot sell more than 20 units of product '{p.ProductName}'.");
        }
    }
}
