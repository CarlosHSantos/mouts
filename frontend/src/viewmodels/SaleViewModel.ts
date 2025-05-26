import { CreateSaleUseCase } from '../usecases/sale/CreateSaleUseCase'
import { GetAllSalesUseCase } from '../usecases/sale/GetAllSalesUseCase'
import { DeleteSaleUseCase } from '../usecases/sale/DeleteSaleUseCase'
import { UpdateSaleUseCase } from '../usecases/sale/UpdateSaleUseCase'
import type { Sale } from '../domain/Sale'
import type { CreateSaleRequest } from '../data/repositories/requests/CreateSaleRequest'
import type { UpdateSaleRequest } from '../data/repositories/requests/UpdateSaleRequest'

export class SaleViewModel {
  private createSaleUseCase: CreateSaleUseCase;
  private getAllSalesUseCase: GetAllSalesUseCase;
  private deleteSaleUseCase: DeleteSaleUseCase;
  private updateSaleUseCase: UpdateSaleUseCase;

  constructor({
    createSaleUseCase,
    getAllSalesUseCase,
    deleteSaleUseCase,
    updateSaleUseCase
  }: {
    createSaleUseCase: CreateSaleUseCase;
    getAllSalesUseCase: GetAllSalesUseCase;
    deleteSaleUseCase: DeleteSaleUseCase;
    updateSaleUseCase: UpdateSaleUseCase;
  }) {
    this.createSaleUseCase = createSaleUseCase;
    this.getAllSalesUseCase = getAllSalesUseCase;
    this.deleteSaleUseCase = deleteSaleUseCase;
    this.updateSaleUseCase = updateSaleUseCase;
  }

  async createSale(request: CreateSaleRequest): Promise<Sale> {
    return await this.createSaleUseCase.execute(request);
  }

  async getAllSales(): Promise<Sale[]> {
    return await this.getAllSalesUseCase.execute();
  }

  // Alias para getAllSales - usado pelo componente
  async fetchSales(): Promise<Sale[]> {
    try {
      console.log('🔄 ViewModel: Fetching sales...');
      const sales = await this.getAllSalesUseCase.execute();
      console.log('📊 ViewModel: Sales received:', {
        count: sales?.length || 0,
        sales: sales?.map(sale => ({
          id: sale.id,
          saleNumber: sale.saleNumber,
          items: sale.items,
          itemsCount: sale.items?.length || 0
        }))
      });
      return sales || [];
    } catch (error) {
      console.error('❌ ViewModel: Error fetching sales:', error);
      throw error;
    }
  }

  async deleteSale(id: string): Promise<void> {
    return await this.deleteSaleUseCase.execute(id);
  }

  async updateSale(request: UpdateSaleRequest): Promise<Sale> {
    return await this.updateSaleUseCase.execute(request);
  }

  // Método adicional para buscar uma venda específica
  async getSaleById(id: string): Promise<Sale> {
    // Implementar quando tiver o GetSaleByIdUseCase
    throw new Error('GetSaleByIdUseCase not implemented yet');
  }

  // Método para cancelar uma venda
  async cancelSale(id: string): Promise<Sale> {
    // Buscar a venda atual e marcar como cancelada
    const currentSale = await this.getSaleById(id);
    const updateRequest: UpdateSaleRequest = {
      ...currentSale,
      isCancelled: true,
      products: currentSale.items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        isCancelled: item.isCancelled
      }))
    };
    return await this.updateSale(updateRequest);
  }
}
