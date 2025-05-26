import type { SaleRepository } from '../../data/repositories/SaleRepository'
import type { Sale } from '../../domain/Sale'

export class GetSaleByIdUseCase {
  private repo: SaleRepository;

  constructor({ saleRepository }: { saleRepository: SaleRepository }) {
    this.repo = saleRepository;
  }

  async execute(id: string): Promise<Sale> {
    return await this.repo.getById(id);
  }
}