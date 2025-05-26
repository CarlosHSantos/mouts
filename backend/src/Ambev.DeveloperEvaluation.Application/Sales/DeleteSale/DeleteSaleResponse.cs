namespace Ambev.DeveloperEvaluation.Application.Sales.DeleteSale
{
    /// <summary>
    /// Response returned after attempting to delete a sale.
    /// </summary>
    public class DeleteSaleResponse
    {
        /// <summary>
        /// Indicates whether the sale deletion was successful.
        /// </summary>
        public bool Success { get; set; }
    }
}
