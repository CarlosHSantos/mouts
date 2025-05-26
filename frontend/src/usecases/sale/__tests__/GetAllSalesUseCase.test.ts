import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetAllSalesUseCase } from '../GetAllSalesUseCase'
import type { SaleRepository } from '../../../data/repositories/SaleRepository'
import type { Sale } from '../../../domain/Sale'

describe('GetAllSalesUseCase', () => {
  let getAllUseCase: GetAllSalesUseCase
  let mockSaleRepository: SaleRepository

  beforeEach(() => {
    mockSaleRepository = {
      getAll: vi.fn(),
      delete: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    } as any

    getAllUseCase = new GetAllSalesUseCase({ saleRepository: mockSaleRepository })
  })

  it('should return all sales', async () => {
    const mockSales: Sale[] = [
      {
        id: '1',
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer 1',
        branch: 'Branch 1',
        isCancelled: false,
        items: []
      },
      {
        id: '2',
        saleDate: '2024-01-02',
        saleNumber: 'S002',
        customer: 'Customer 2',
        branch: 'Branch 2',
        isCancelled: false,
        items: []
      }
    ]

    vi.mocked(mockSaleRepository.getAll).mockResolvedValue(mockSales)

    const result = await getAllUseCase.execute()

    expect(result).toEqual(mockSales)
    expect(mockSaleRepository.getAll).toHaveBeenCalledTimes(1)
  })

  it('should handle empty sales list', async () => {
    vi.mocked(mockSaleRepository.getAll).mockResolvedValue([])

    const result = await getAllUseCase.execute()

    expect(result).toEqual([])
    expect(mockSaleRepository.getAll).toHaveBeenCalledTimes(1)
  })

  it('should handle repository errors', async () => {
    const error = new Error('Repository error')
    vi.mocked(mockSaleRepository.getAll).mockRejectedValue(error)

    await expect(getAllUseCase.execute()).rejects.toThrow('Repository error')
  })
})