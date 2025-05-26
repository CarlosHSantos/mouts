using FluentValidation;

namespace Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSale
{
    /// <summary>
    /// Validator for <see cref="GetSaleRequest"/> to ensure the request data is valid.
    /// </summary>
    public class GetSaleRequestValidator : AbstractValidator<GetSaleRequest>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GetSaleRequestValidator"/> class
        /// and defines validation rules for the GetSale request.
        /// </summary>
        public GetSaleRequestValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
