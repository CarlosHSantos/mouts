export interface UpdateSaleRequest {
  id: string;
  saleDate: string;
  saleNumber: string;
  customer: string;
  branch: string;
  isCancelled: boolean;
  products: UpdateSaleItemDto[];
}

export interface UpdateSaleItemDto {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  isCancelled: boolean;
}