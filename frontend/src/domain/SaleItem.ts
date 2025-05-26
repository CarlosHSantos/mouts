export interface SaleItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  isCancelled: boolean;
  saleId: string;
}