import type { CreateSaleRequest } from '../../data/repositories/requests/CreateSaleRequest';
import type { SaleRepository } from '../../data/repositories/SaleRepository'

import type { Sale } from '../../domain/Sale'

export class CreateSaleUseCase {
  private repo: SaleRepository;

  constructor({ saleRepository }: { saleRepository: SaleRepository }) {
    this.repo = saleRepository;
  }

  async execute(request: CreateSaleRequest): Promise<Sale> {
    return await this.repo.create(request);
  }
}
