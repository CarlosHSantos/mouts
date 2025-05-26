export interface CreateSaleItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSaleRequest {
  saleDate: string;
  saleNumber: string;
  customer: string;
  branch: string;
  products: CreateSaleItemDto[];
}