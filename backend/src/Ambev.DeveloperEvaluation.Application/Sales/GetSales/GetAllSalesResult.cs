using System;
using System.Collections.Generic;

/// <summary>
/// Result DTO representing a sale with its details.
/// </summary>
public class GetAllSalesResult
{
    /// <summary>
    /// Unique identifier of the sale.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Unique sale number or identifier.
    /// </summary>
    public string SaleNumber { get; set; } = string.Empty;

    /// <summary>
    /// Date when the sale was made.
    /// </summary>
    public DateTime SaleDate { get; set; }

    /// <summary>
    /// Customer name (denormalized for convenience).
    /// </summary>
    public string Customer { get; set; } = string.Empty;

    /// <summary>
    /// Branch name where the sale was made (denormalized).
    /// </summary>
    public string Branch { get; set; } = string.Empty;

    /// <summary>
    /// List of sale items/products included in this sale.
    /// </summary>
    public List<GetSaleItemResult> Products { get; set; } = new();

    /// <summary>
    /// Total amount of the sale.
    /// </summary>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Indicates whether the sale was cancelled.
    /// </summary>
    public bool IsCancelled { get; set; }
}

/// <summary>
/// DTO representing an individual product item in a sale.
/// </summary>
public class GetSaleItemResult
{
    /// <summary>
    /// Unique identifier of the product item.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Name of the product sold.
    /// </summary>
    public string ProductName { get; set; } = string.Empty;

    /// <summary>
    /// Quantity of the product sold.
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Price per unit of the product.
    /// </summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Discount applied on the product.
    /// </summary>
    public decimal Discount { get; set; }

    /// <summary>
    /// Total amount for this item (calculated as Quantity * UnitPrice - Discount).
    /// </summary>
    public decimal Total { get; set; }

    /// <summary>
    /// Indicates whether this product item was cancelled.
    /// </summary>
    public bool IsCancelled { get; set; }
}
