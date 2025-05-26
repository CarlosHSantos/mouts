using Bogus;
using FluentAssertions;
using Xunit;

namespace Ambev.DeveloperEvaluation.Unit.Domain.Entities
{
    public class SaleTests
    {
        private readonly Faker _faker = new();

        [Fact]
        public void ApplyDiscount_ShouldApply20Percent_WhenQuantityIs10OrMore()
        {
            var item = new SaleItem
            {
                ProductName = "Test Product",
                Quantity = 10,
                UnitPrice = 100
            };

            item.ApplyDiscount();

            item.Discount.Should().Be(200); 
            item.Total.Should().Be(800);
        }

        [Fact]
        public void ApplyDiscount_ShouldApply10Percent_WhenQuantityIsBetween4And9()
        {
            var item = new SaleItem
            {
                ProductName = "Test Product",
                Quantity = 5,
                UnitPrice = 50
            };

            item.ApplyDiscount();

            item.Discount.Should().Be(25);
            item.Total.Should().Be(225);
        }

        [Fact]
        public void ApplyDiscount_ShouldApplyNoDiscount_WhenQuantityIsLessThan4()
        {
            var item = new SaleItem
            {
                ProductName = "Test Product",
                Quantity = 2,
                UnitPrice = 30
            };

            item.ApplyDiscount();

            item.Discount.Should().Be(0);
            item.Total.Should().Be(60);
        }

        [Fact]
        public void ApplyDiscount_ShouldThrowException_WhenQuantityExceeds20()
        {
            var item = new SaleItem
            {
                ProductName = "Test Product",
                Quantity = 21,
                UnitPrice = 10
            };

            Action act = () => item.ApplyDiscount();

            act.Should().Throw<DomainException>()
                .WithMessage("Cannot sell more than 20 units of product 'Test Product'");
        }

        [Fact]
        public void TotalAmount_ShouldBeSumOfAllItemsTotal()
        {
            var items = new List<SaleItem>
        {
            new SaleItem { ProductName = "P1", Quantity = 2, UnitPrice = 50 },
            new SaleItem { ProductName = "P2", Quantity = 5, UnitPrice = 30 }
        };

            var sale = new Sale
            {
                SaleDate = DateTime.UtcNow,
                SaleNumber = "S123",
                Branch = "Main",
                Customer = "John Doe",
                Products = items
            };

            sale.ApplyDiscountRules();

            var expectedTotal = items.Sum(i => i.Total);
            sale.TotalAmount.Should().Be(expectedTotal);
        }

        [Fact]
        public void Sale_ShouldInitializeWithEmptyProductList()
        {
            var sale = new Sale();
            sale.Products.Should().NotBeNull();
        }

        [Fact]
        public void Sale_WithFaker_ShouldGenerateValidData()
        {
            var itemFaker = new Faker<SaleItem>()
                .RuleFor(i => i.Id, f => Guid.NewGuid())
                .RuleFor(i => i.ProductName, f => f.Commerce.ProductName())
                .RuleFor(i => i.Quantity, f => f.Random.Decimal(1, 10))
                .RuleFor(i => i.UnitPrice, f => f.Random.Decimal(5, 100));

            var items = itemFaker.Generate(3);

            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SaleDate = DateTime.UtcNow,
                SaleNumber = _faker.Random.AlphaNumeric(8),
                Customer = _faker.Person.FullName,
                Branch = _faker.Company.CompanyName(),
                Products = items
            };

            sale.ApplyDiscountRules();

            sale.TotalAmount.Should().BeGreaterThan(0);
            sale.Products.Should().AllSatisfy(p => p.Discount.Should().BeGreaterOrEqualTo(0));
        }
    }
}
