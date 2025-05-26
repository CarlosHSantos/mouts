import { describe, it, expect } from 'vitest'
import type { SaleItem } from '../SaleItem'

describe('SaleItem Domain Model', () => {
  const mockSaleItem: SaleItem = {
    id: '1',
    productName: 'Product Test',
    quantity: 3,
    unitPrice: 50,
    discount: 5,
    total: 145,
    isCancelled: false,
    saleId: 'sale-1'
  }

  it('should calculate total correctly', () => {
    const expectedTotal = (mockSaleItem.quantity * mockSaleItem.unitPrice) - mockSaleItem.discount
    expect(expectedTotal).toBe(145)
  })

  it('should have valid properties', () => {
    expect(mockSaleItem.id).toBe('1')
    expect(mockSaleItem.productName).toBe('Product Test')
    expect(mockSaleItem.quantity).toBe(3)
    expect(mockSaleItem.unitPrice).toBe(50)
    expect(mockSaleItem.discount).toBe(5)
    expect(mockSaleItem.isCancelled).toBe(false)
    expect(mockSaleItem.saleId).toBe('sale-1')
  })
})