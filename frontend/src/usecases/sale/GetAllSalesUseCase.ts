import type { SaleRepository } from '../../data/repositories/SaleRepository';
import type { Sale } from '../../domain/Sale';

export class GetAllSalesUseCase {
  private repo: SaleRepository;

  constructor({ saleRepository }: { saleRepository: SaleRepository }) {
    this.repo = saleRepository;
  }

  async execute(): Promise<Sale[]> {
    try {
      console.log('🔄 UseCase: Getting all sales...');
      const sales = await this.repo.getAll();
      console.log('📊 UseCase: Sales from repository:', {
        count: sales?.length || 0,
        sales: sales?.map(sale => ({
          id: sale.id,
          saleNumber: sale.saleNumber,
          items: sale.items,
          itemsCount: sale.items?.length || 0,
          itemsStructure: sale.items?.map(item => ({
            id: item.id,
            productName: item.productName,
            quantity: item.quantity
          }))
        }))
      });
      return sales;
    } catch (error) {
      console.error('❌ UseCase: Error getting sales:', error);
      throw error;
    }
  }
}
