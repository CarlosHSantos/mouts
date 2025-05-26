using Ambev.DeveloperEvaluation.Application.Sales.UpdateSale;
using Ambev.DeveloperEvaluation.Domain.Entities;

namespace Ambev.DeveloperEvaluation.Unit.Application;

public static class UpdateSaleHandlerTestData
{
    public static UpdateSaleCommand GenerateValidCommand()
    {
        return new UpdateSaleCommand
        {
            Id = Guid.NewGuid(),
            SaleNumber = "S-1001",
            SaleDate = DateTime.UtcNow.AddDays(-2),
            Customer = "Cliente Teste",
            Branch = "Unidade 01",
            IsCancelled = false,
            Products = new List<UpdateSaleProductCommand>
            {
                new UpdateSaleProductCommand
                {
                    Id = Guid.NewGuid(),
                    ProductName = "Produto 1",
                    Quantity = 2,
                    UnitPrice = 10,
                    Discount = 0,
                    IsCancelled = false
                }
            }
        };
    }

    public static Sale GenerateExistingSale(Guid id)
    {
        return new Sale
        {
            Id = id,
            SaleNumber = "S-1001",
            SaleDate = DateTime.UtcNow.AddDays(-2),
            Customer = "Cliente Teste",
            Branch = "Unidade 01",
            IsCancelled = false,
            Products = new List<SaleItem>
            {
                new SaleItem
                {
                    Id = Guid.NewGuid(),
                    ProductName = "Produto 1",
                    Quantity = 2,
                    UnitPrice = 10,
                    Discount = 0,
                    IsCancelled = false
                }
            }
        };
    }
}
