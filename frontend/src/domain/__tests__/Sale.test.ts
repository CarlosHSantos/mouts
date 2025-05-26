import { describe, it, expect } from 'vitest'
import type { Sale } from '../Sale'
import type { SaleItem } from '../SaleItem'

describe('Sale Domain Model', () => {
  const mockSaleItem: SaleItem = {
    id: '1',
    productName: 'Product 1',
    quantity: 2,
    unitPrice: 100,
    discount: 10,
    total: 190,
    isCancelled: false,
    saleId: 'sale-1'
  }

  const mockSale: Sale = {
    id: 'sale-1',
    saleDate: '2024-01-01',
    saleNumber: 'S001',
    customer: 'Customer 1',
    branch: 'Branch 1',
    isCancelled: false,
    items: [mockSaleItem]
  }

  it('should have correct structure', () => {
    expect(mockSale).toHaveProperty('id')
    expect(mockSale).toHaveProperty('saleDate')
    expect(mockSale).toHaveProperty('saleNumber')
    expect(mockSale).toHaveProperty('customer')
    expect(mockSale).toHaveProperty('branch')
    expect(mockSale).toHaveProperty('isCancelled')
    expect(mockSale).toHaveProperty('items')
  })

  it('should have items with correct structure', () => {
    expect(mockSale.items[0]).toHaveProperty('id')
    expect(mockSale.items[0]).toHaveProperty('productName')
    expect(mockSale.items[0]).toHaveProperty('quantity')
    expect(mockSale.items[0]).toHaveProperty('unitPrice')
    expect(mockSale.items[0]).toHaveProperty('discount')
    expect(mockSale.items[0]).toHaveProperty('total')
    expect(mockSale.items[0]).toHaveProperty('isCancelled')
    expect(mockSale.items[0]).toHaveProperty('saleId')
  })
})