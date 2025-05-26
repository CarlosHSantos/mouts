import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteSaleUseCase } from '../DeleteSaleUseCase'
import type { SaleRepository } from '../../../data/repositories/SaleRepository'

describe('DeleteSaleUseCase', () => {
  let deleteUseCase: DeleteSaleUseCase
  let mockSaleRepository: SaleRepository

  beforeEach(() => {
    mockSaleRepository = {
      delete: vi.fn(),
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    } as any

    deleteUseCase = new DeleteSaleUseCase({ saleRepository: mockSaleRepository })
  })

  it('should delete sale successfully', async () => {
    const saleId = 'sale-1'
    
    await deleteUseCase.execute(saleId)
    
    expect(mockSaleRepository.delete).toHaveBeenCalledWith(saleId)
    expect(mockSaleRepository.delete).toHaveBeenCalledTimes(1)
  })

  it('should handle repository errors', async () => {
    const saleId = 'sale-1'
    const error = new Error('Repository error')
    vi.mocked(mockSaleRepository.delete).mockRejectedValue(error)

    await expect(deleteUseCase.execute(saleId)).rejects.toThrow('Repository error')
  })
})