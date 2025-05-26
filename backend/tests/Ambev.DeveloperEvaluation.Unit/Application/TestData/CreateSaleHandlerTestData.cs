using System;
using System.Collections.Generic;
using Ambev.DeveloperEvaluation.Application.Sales.CreateSale;

namespace Ambev.DeveloperEvaluation.Unit.Application
{
    public static class CreateSaleHandlerTestData
    {
        public static CreateSaleCommand GenerateValidCommand()
        {
            return new CreateSaleCommand
            {
                SaleDate = DateTime.UtcNow.AddDays(-1),
                SaleNumber = "123456",
                Customer = "Carlos Henrique",
                Branch = "Central Brand",
                Products = new List<SaleItemDto>
                {
                    new SaleItemDto { ProductName = "Product A", Quantity = 2, UnitPrice = 50 },
                    new SaleItemDto { ProductName = "Product B", Quantity = 1, UnitPrice = 30 }
                }
            };
        }
    }
}
