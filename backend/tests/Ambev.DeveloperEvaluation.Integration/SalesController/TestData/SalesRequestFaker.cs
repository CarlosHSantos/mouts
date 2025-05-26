using Ambev.DeveloperEvaluation.Application.Sales.CreateSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.DeleteSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSales;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.UpdateSale;
using Bogus;

public static class SalesRequestFaker
{
    public static Faker<CreateSaleItemDto> CreateSaleItemDtoFaker() =>
        new Faker<CreateSaleItemDto>()
            .RuleFor(p => p.ProductName, f => f.Commerce.ProductName())
            .RuleFor(p => p.Quantity, f => f.Random.Int(1, 10))
            .RuleFor(p => p.UnitPrice, f => Math.Round(f.Random.Decimal(1, 100), 2));

    public static Faker<CreateSaleRequest> CreateSaleRequestFaker() =>
        new Faker<CreateSaleRequest>()
            .RuleFor(s => s.SaleDate, f => f.Date.Past(1))
            .RuleFor(s => s.SaleNumber, f => f.Commerce.Ean13())
            .RuleFor(s => s.Customer, f => f.Person.FullName)
            .RuleFor(s => s.Branch, f => f.Company.CompanyName())
            .RuleFor(s => s.Products, f => CreateSaleItemDtoFaker().Generate(f.Random.Int(1, 5)));

    public static Faker<CreateSaleCommand> CreateSaleCommandFaker()
    {
        var itemFaker = new Faker<Ambev.DeveloperEvaluation.Application.Sales.CreateSale.SaleItemDto>()
            .RuleFor(x => x.ProductName, f => f.Commerce.ProductName())
            .RuleFor(x => x.Quantity, f => f.Random.Decimal(1, 10))
            .RuleFor(x => x.UnitPrice, f => f.Finance.Amount(10, 100));

        return new Faker<CreateSaleCommand>()
            .RuleFor(x => x.SaleDate, f => f.Date.Past())
            .RuleFor(x => x.SaleNumber, f => f.Random.AlphaNumeric(10).ToUpper())
            .RuleFor(x => x.Customer, f => f.Name.FullName())
            .RuleFor(x => x.Branch, f => f.Company.CompanyName())
            .RuleFor(x => x.Products, f => itemFaker.Generate(f.Random.Int(1, 5)));
    }

    public static Faker<UpdateSaleItemDto> UpdateSaleItemDtoFaker() =>
        new Faker<UpdateSaleItemDto>()
            .RuleFor(i => i.Id, f => f.Random.Guid())
            .RuleFor(i => i.ProductName, f => f.Commerce.ProductName())
            .RuleFor(i => i.Quantity, f => f.Random.Int(1, 10))
            .RuleFor(i => i.UnitPrice, f => Math.Round(f.Random.Decimal(1, 100), 2))
            .RuleFor(i => i.IsCancelled, f => f.Random.Bool(0.1f));

    public static Faker<UpdateSaleRequest> UpdateSaleRequestFaker() =>
        new Faker<UpdateSaleRequest>()
            .RuleFor(s => s.Id, f => f.Random.Guid())
            .RuleFor(s => s.SaleDate, f => f.Date.Past(1))
            .RuleFor(s => s.SaleNumber, f => f.Commerce.Ean13())
            .RuleFor(s => s.Customer, f => f.Person.FullName)
            .RuleFor(s => s.Branch, f => f.Company.CompanyName())
            .RuleFor(s => s.Products, f => UpdateSaleItemDtoFaker().Generate(f.Random.Int(1, 5)))
            .RuleFor(s => s.IsCancelled, f => f.Random.Bool(0.05f));

    public static Faker<GetSaleRequest> GetSaleRequestFaker() =>
        new Faker<GetSaleRequest>()
            .RuleFor(r => r.Id, f => f.Random.Guid());

    public static Faker<GetAllSalesRequest> GetAllSalesRequestFaker() =>
        new Faker<GetAllSalesRequest>()
            .RuleFor(r => r.Page, f => f.Random.Int(1, 5))
            .RuleFor(r => r.PageSize, f => f.Random.Int(5, 20));

    public static Faker<DeleteSaleRequest> DeleteSaleRequestFaker() =>
        new Faker<DeleteSaleRequest>()
            .RuleFor(r => r.Id, f => f.Random.Guid());
}
