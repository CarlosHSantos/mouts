import type { UpdateSaleRequest } from '../../data/repositories/requests/UpdateSaleRequest';
import type { SaleRepository } from '../../data/repositories/SaleRepository'
import type { Sale } from '../../domain/Sale'

export class UpdateSaleUseCase {
  private repo: SaleRepository;

  constructor({ saleRepository }: { saleRepository: SaleRepository }) {
    this.repo = saleRepository;
  }

  async execute(request: UpdateSaleRequest): Promise<Sale> {
    return await this.repo.update(request);
  }
}