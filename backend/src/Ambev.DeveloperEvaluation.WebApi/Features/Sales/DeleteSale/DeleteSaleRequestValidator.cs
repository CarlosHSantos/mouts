using FluentValidation;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.DeleteSale
{
    /// <summary>
    /// Validator for <see cref="DeleteSaleRequest"/> to ensure the delete request is valid.
    /// </summary>
    public class DeleteSaleRequestValidator : AbstractValidator<DeleteSaleRequest>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DeleteSaleRequestValidator"/> class
        /// and defines validation rules for the delete sale request.
        /// </summary>
        public DeleteSaleRequestValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
