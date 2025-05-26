import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateSaleUseCase } from '../CreateSaleUseCase'
import type { SaleRepository } from '../../../data/repositories/SaleRepository'

describe('CreateSaleUseCase', () => {
  let createUseCase: CreateSaleUseCase
  let mockSaleRepository: SaleRepository

  beforeEach(() => {
    mockSaleRepository = {
      create: vi.fn(),
      getAll: vi.fn(),
      delete: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
    } as any

    createUseCase = new CreateSaleUseCase({ saleRepository: mockSaleRepository })
  })

  it('should create sale successfully', async () => {
    const createRequest = {
      saleDate: '2024-01-01',
      saleNumber: 'S001',
      customer: 'Customer 1',
      branch: 'Branch 1',
      products: [
        {
          productName: 'Product 1',
          quantity: 2,
          unitPrice: 100
        }
      ]
    }

    const mockCreatedSale = {
      id: '1',
      ...createRequest,
      isCancelled: false,
      items: []
    }

    vi.mocked(mockSaleRepository.create).mockResolvedValue(mockCreatedSale)

    const result = await createUseCase.execute(createRequest)

    expect(result).toEqual(mockCreatedSale)
    expect(mockSaleRepository.create).toHaveBeenCalledWith(createRequest)
    expect(mockSaleRepository.create).toHaveBeenCalledTimes(1)
  })
})