using Ambev.DeveloperEvaluation.Domain.Entities;
using Ambev.DeveloperEvaluation.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Ambev.DeveloperEvaluation.ORM.Repositories;

/// <summary>
/// Implementation of ISaleRepository using Entity Framework Core
/// </summary>
public class SaleRepository : ISaleRepository
{
    private readonly DefaultContext _context;

    /// <summary>
    /// Initializes a new instance of SaleRepository
    /// </summary>
    /// <param name="context">The database context</param>
    public SaleRepository(DefaultContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Creates a new Sale in the database
    /// </summary>
    /// <param name="Sale">The Sale to create</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The created Sale</returns>
    public async Task<Sale> CreateAsync(Sale Sale, CancellationToken cancellationToken = default)
    {
        await _context.Sales.AddAsync(Sale, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return Sale;
    }

    /// <summary>
    /// Updates an existing Sale in the database
    /// </summary>
    /// <param name="sale">The Sale to be updated</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns></returns>
    public async Task<Sale> UpdateAsync(Sale sale, CancellationToken cancellationToken = default)
    {
        foreach (var entry in _context.ChangeTracker.Entries())
        {
            Console.WriteLine($"Entity: {entry.Entity.GetType().Name}, State: {entry.State}");
        }
        await _context.SaveChangesAsync(cancellationToken);
        return sale;
    }


    /// <summary>
    /// Retrieves a Sale by their unique identifier
    /// </summary>
    /// <param name="id">The unique identifier of the Sale</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The Sale if found, null otherwise</returns>
    public async Task<Sale?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Sales
            .Include(s => s.Products)
            .AsTracking()
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    /// <summary>
    /// Retrieves all Sales 
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The Sale if found, null otherwise</returns>
    public async Task<List<Sale?>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var sales = await _context.Sales
            .Include(s => s.Products)
            .AsTracking()
            .ToListAsync(cancellationToken);

        return sales.Cast<Sale?>().ToList();
    }

    /// <summary>
    /// Deletes a Sale from the database
    /// </summary>
    /// <param name="id">The unique identifier of the Sale to delete</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the Sale was deleted, false if not found</returns>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var sale = await GetByIdAsync(id, cancellationToken);
        if (sale == null)
            return false;

        _context.SaleItem.RemoveRange(sale.Products);

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
