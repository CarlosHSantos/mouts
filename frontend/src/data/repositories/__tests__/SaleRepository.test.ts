import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { SaleRepository } from '../SaleRepository'
import type { Sale } from '../../../domain/Sale'

// Mock the logging functions
vi.mock('../../../utils/logger', () => ({
  logApiRequest: vi.fn(),
  logApiResponse: vi.fn(),
}))

describe('SaleRepository', () => {
  let repository: SaleRepository
  let mockAxios: MockAdapter

  beforeEach(() => {
    repository = new SaleRepository()
    mockAxios = new MockAdapter(axios)
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('delete', () => {
    it('should delete sale successfully', async () => {
      const saleId = 'sale-1'
      mockAxios.onDelete(`/api/sales/${saleId}`).reply(200)

      await repository.delete(saleId)

      expect(mockAxios.history.delete).toHaveLength(1)
      expect(mockAxios.history.delete[0].url).toBe(`/api/sales/${saleId}`)
    })

    it('should handle delete errors', async () => {
      const saleId = 'sale-1'
      mockAxios.onDelete(`/api/sales/${saleId}`).reply(404, { message: 'Sale not found' })

      await expect(repository.delete(saleId)).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should create sale successfully', async () => {
      const createRequest = {
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer 1',
        branch: 'Branch 1',
        products: []
      }

      const mockResponse = {
        id: '1',
        ...createRequest,
        isCancelled: false,
        items: []
      }

      mockAxios.onPost('/api/sales').reply(201, mockResponse)

      const result = await repository.create(createRequest)

      expect(result).toEqual(mockResponse)
    })
  })
})