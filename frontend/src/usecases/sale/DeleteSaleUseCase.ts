import { SaleRepository } from '../../data/repositories/SaleRepository';

export class DeleteSaleUseCase {
  private repo: SaleRepository;

  constructor({ saleRepository }: { saleRepository: SaleRepository }) {
    this.repo = saleRepository;
  }

  async execute(id: string) {
    await this.repo.delete(id);
  }
}
