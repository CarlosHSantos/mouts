using Bogus;

namespace Ambev.DeveloperEvaluation.Unit.Domain.Entities.TestData;

public static class SaleTestData
{
    private static readonly Faker<SaleItem> SaleItemFaker = new Faker<SaleItem>()
        .RuleFor(p => p.Id, f => Guid.NewGuid())
        .RuleFor(p => p.ProductName, f => f.Commerce.ProductName())
        .RuleFor(p => p.Quantity, f => f.Random.Decimal(1, 20)) 
        .RuleFor(p => p.UnitPrice, f => f.Random.Decimal(10, 100))
        .RuleFor(p => p.IsCancelled, f => false)
        .RuleFor(p => p.SaleId, f => Guid.NewGuid()) 
        .FinishWith((f, item) => item.ApplyDiscount());

    private static readonly Faker<Sale> SaleFaker = new Faker<Sale>()
        .RuleFor(s => s.Id, f => Guid.NewGuid())
        .RuleFor(s => s.SaleNumber, f => f.Random.AlphaNumeric(8))
        .RuleFor(s => s.SaleDate, f => f.Date.Recent())
        .RuleFor(s => s.Customer, f => f.Name.FullName())
        .RuleFor(s => s.Branch, f => f.Company.CompanyName())
        .RuleFor(s => s.IsCancelled, f => false)
        .RuleFor(s => s.Products, (f, s) =>
        {
            var saleId = s.Id;
            return SaleItemFaker.Clone()
                .RuleFor(p => p.SaleId, _ => saleId)
                .Generate(f.Random.Int(1, 5));
        });

    public static Sale GenerateValidSale()
    {
        var sale = SaleFaker.Generate();
        sale.ApplyDiscountRules();
        return sale;
    }
}
