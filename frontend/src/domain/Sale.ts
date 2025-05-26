import type { SaleItem } from './SaleItem'

export interface Sale {
  id: string;
  saleDate: string;
  saleNumber: string;
  customer: string;
  branch: string;
  isCancelled: boolean;
  products: SaleItem[];
  totalAmount: number;
}