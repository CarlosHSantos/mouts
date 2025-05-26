import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SaleViewModel } from '../SaleViewModel'
import type { CreateSaleRequest } from '../../data/repositories/requests/CreateSaleRequest'
import type { UpdateSaleRequest } from '../../data/repositories/requests/UpdateSaleRequest'

// Mock all use cases
vi.mock('../../usecases/sale/CreateSaleUseCase')
vi.mock('../../usecases/sale/GetAllSalesUseCase')
vi.mock('../../usecases/sale/DeleteSaleUseCase')
vi.mock('../../usecases/sale/UpdateSaleUseCase')

describe('SaleViewModel', () => {
  let viewModel: SaleViewModel
  let mockUseCases: any

  beforeEach(() => {
    mockUseCases = {
      createSaleUseCase: {
        execute: vi.fn()
      },
      getAllSalesUseCase: {
        execute: vi.fn()
      },
      deleteSaleUseCase: {
        execute: vi.fn()
      },
      updateSaleUseCase: {
        execute: vi.fn()
      }
    }

    viewModel = new SaleViewModel(mockUseCases)
  })

  describe('createSale', () => {
    it('should create sale successfully', async () => {
      const createRequest: CreateSaleRequest = {
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

      const mockResponse = { 
        id: '1', 
        ...createRequest,
        isCancelled: false,
        items: []
      }
      mockUseCases.createSaleUseCase.execute.mockResolvedValue(mockResponse)

      const result = await viewModel.createSale(createRequest)

      expect(result).toEqual(mockResponse)
      expect(mockUseCases.createSaleUseCase.execute).toHaveBeenCalledWith(createRequest)
      expect(mockUseCases.createSaleUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should handle creation errors', async () => {
      const createRequest: CreateSaleRequest = {
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer 1',
        branch: 'Branch 1',
        products: []
      }

      const error = new Error('Creation failed')
      mockUseCases.createSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.createSale(createRequest)).rejects.toThrow('Creation failed')
      expect(mockUseCases.createSaleUseCase.execute).toHaveBeenCalledWith(createRequest)
    })

    it('should validate required fields in create request', async () => {
      const invalidRequest = {
        saleDate: '',
        saleNumber: 'S001',
        customer: 'Customer 1',
        branch: 'Branch 1',
        products: []
      } as CreateSaleRequest

      const error = new Error('Sale date is required')
      mockUseCases.createSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.createSale(invalidRequest)).rejects.toThrow('Sale date is required')
    })
  })

  describe('fetchSales', () => {
    it('should fetch all sales successfully', async () => {
      const mockSales = [
        {
          id: '1',
          saleDate: '2024-01-01',
          saleNumber: 'S001',
          customer: 'Customer 1',
          branch: 'Branch 1',
          isCancelled: false,
          items: []
        }
      ]

      mockUseCases.getAllSalesUseCase.execute.mockResolvedValue(mockSales)

      const result = await viewModel.fetchSales()

      expect(result).toEqual(mockSales)
      expect(mockUseCases.getAllSalesUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch sales errors', async () => {
      const error = new Error('Failed to fetch sales')
      mockUseCases.getAllSalesUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.fetchSales()).rejects.toThrow('Failed to fetch sales')
    })
  })

  describe('getAllSales', () => {
    it('should get all sales successfully', async () => {
      const mockSales = [
        {
          id: '1',
          saleDate: '2024-01-01',
          saleNumber: 'S001',
          customer: 'Customer 1',
          branch: 'Branch 1',
          isCancelled: false,
          items: []
        }
      ]

      mockUseCases.getAllSalesUseCase.execute.mockResolvedValue(mockSales)

      const result = await viewModel.getAllSales()

      expect(result).toEqual(mockSales)
      expect(mockUseCases.getAllSalesUseCase.execute).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteSale', () => {
    it('should delete sale successfully', async () => {
      const saleId = 'sale-1'
      mockUseCases.deleteSaleUseCase.execute.mockResolvedValue(undefined)

      await viewModel.deleteSale(saleId)

      expect(mockUseCases.deleteSaleUseCase.execute).toHaveBeenCalledWith(saleId)
      expect(mockUseCases.deleteSaleUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should handle delete errors', async () => {
      const saleId = 'sale-1'
      const error = new Error('Delete failed')
      mockUseCases.deleteSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.deleteSale(saleId)).rejects.toThrow('Delete failed')
      expect(mockUseCases.deleteSaleUseCase.execute).toHaveBeenCalledWith(saleId)
    })

    it('should handle non-existent sale deletion', async () => {
      const saleId = 'non-existent-sale'
      const error = new Error('Sale not found')
      mockUseCases.deleteSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.deleteSale(saleId)).rejects.toThrow('Sale not found')
    })

    it('should validate sale id parameter', async () => {
      const emptySaleId = ''
      const error = new Error('Sale ID is required')
      mockUseCases.deleteSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.deleteSale(emptySaleId)).rejects.toThrow('Sale ID is required')
    })
  })

  describe('updateSale', () => {
    it('should update sale successfully', async () => {
      const updateRequest: UpdateSaleRequest = {
        id: 'sale-1',
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer Updated',
        branch: 'Branch 1',
        isCancelled: false,
        products: [
          {
            id: 'item-1',
            productName: 'Product 1',
            quantity: 2,
            unitPrice: 100,
            isCancelled: false
          }
        ]
      }

      const mockResponse = { 
        ...updateRequest,
        items: [
          {
            id: 'item-1',
            productName: 'Product 1',
            quantity: 2,
            unitPrice: 100,
            discount: 0,
            total: 200,
            isCancelled: false,
            saleId: 'sale-1'
          }
        ]
      }
      mockUseCases.updateSaleUseCase.execute.mockResolvedValue(mockResponse)

      const result = await viewModel.updateSale(updateRequest)

      expect(result).toEqual(mockResponse)
      expect(mockUseCases.updateSaleUseCase.execute).toHaveBeenCalledWith(updateRequest)
      expect(mockUseCases.updateSaleUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should handle update errors', async () => {
      const updateRequest: UpdateSaleRequest = {
        id: 'sale-1',
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer Updated',
        branch: 'Branch 1',
        isCancelled: false,
        products: []
      }

      const error = new Error('Update failed')
      mockUseCases.updateSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.updateSale(updateRequest)).rejects.toThrow('Update failed')
      expect(mockUseCases.updateSaleUseCase.execute).toHaveBeenCalledWith(updateRequest)
    })

    it('should handle sale cancellation', async () => {
      const cancelRequest: UpdateSaleRequest = {
        id: 'sale-1',
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer 1',
        branch: 'Branch 1',
        isCancelled: true,
        products: []
      }

      const mockResponse = { 
        ...cancelRequest,
        items: []
      }
      mockUseCases.updateSaleUseCase.execute.mockResolvedValue(mockResponse)

      const result = await viewModel.updateSale(cancelRequest)

      expect(result.isCancelled).toBe(true)
      expect(mockUseCases.updateSaleUseCase.execute).toHaveBeenCalledWith(cancelRequest)
    })

    it('should validate update request fields', async () => {
      const invalidRequest = {
        id: '',
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer Updated',
        branch: 'Branch 1',
        isCancelled: false,
        products: []
      } as UpdateSaleRequest

      const error = new Error('Sale ID is required')
      mockUseCases.updateSaleUseCase.execute.mockRejectedValue(error)

      await expect(viewModel.updateSale(invalidRequest)).rejects.toThrow('Sale ID is required')
    })
  })

  describe('error handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      const unexpectedError = new Error('Unexpected error occurred')
      mockUseCases.getAllSalesUseCase.execute.mockRejectedValue(unexpectedError)

      await expect(viewModel.getAllSales()).rejects.toThrow('Unexpected error occurred')
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      mockUseCases.createSaleUseCase.execute.mockRejectedValue(timeoutError)

      const createRequest: CreateSaleRequest = {
        saleDate: '2024-01-01',
        saleNumber: 'S001',
        customer: 'Customer 1',
        branch: 'Branch 1',
        products: []
      }

      await expect(viewModel.createSale(createRequest)).rejects.toThrow('Request timeout')
    })
  })
})