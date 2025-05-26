import { createContainer, asClass, InjectionMode } from 'awilix';
import { SaleRepository } from '../data/repositories/SaleRepository';
import { GetAllSalesUseCase } from '../usecases/sale/GetAllSalesUseCase';
import { DeleteSaleUseCase } from '../usecases/sale/DeleteSaleUseCase';
import { CreateSaleUseCase } from '../usecases/sale/CreateSaleUseCase';
import { UpdateSaleUseCase } from '../usecases/sale/UpdateSaleUseCase';
import { SaleViewModel } from '../viewmodels/SaleViewModel';

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  saleRepository: asClass(SaleRepository).singleton(),
  getAllSalesUseCase: asClass(GetAllSalesUseCase).singleton(),
  deleteSaleUseCase: asClass(DeleteSaleUseCase).singleton(),
  createSaleUseCase: asClass(CreateSaleUseCase).singleton(),
  updateSaleUseCase: asClass(UpdateSaleUseCase).singleton(),
  saleViewModel: asClass(SaleViewModel).singleton(),
});
