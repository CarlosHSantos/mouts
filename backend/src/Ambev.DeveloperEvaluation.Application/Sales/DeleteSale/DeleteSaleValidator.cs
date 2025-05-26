using FluentValidation;

namespace Ambev.DeveloperEvaluation.Application.Sales.DeleteSale
{
    /// <summary>
    /// Validator for <see cref="DeleteSaleCommand"/> to ensure the command data is valid.
    /// </summary>
    public class DeleteSaleValidator : AbstractValidator<DeleteSaleCommand>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DeleteSaleValidator"/> class.
        /// </summary>
        public DeleteSaleValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Sale ID must be provided.");
        }
    }
}
