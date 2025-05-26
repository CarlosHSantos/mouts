import axios from 'axios';
import type { Sale } from '../../domain/Sale';
import { logApiRequest, logApiResponse, logApiError } from '../../utils/apiDebug';
import type { CreateSaleRequest } from './requests/CreateSaleRequest';
import type { UpdateSaleRequest } from './requests/UpdateSaleRequest';

export class SaleRepository {
  async getAll(): Promise<Sale[]> {
    try {
      logApiRequest('GET', '/api/sales');
      const res = await axios.get('/api/sales');
      logApiResponse('GET', '/api/sales', res.data);
      
      const salesData = res.data.data || res.data;
      
      // Normalizar dados vindos da API
      const normalizedSales = Array.isArray(salesData) ? salesData.map(sale => ({
        ...sale,
        products: Array.isArray(sale.products) ? sale.products : [],
        totalAmount: Number(sale.totalAmount) || 0
      })) : [];
      
      return normalizedSales;
    } catch (error) {
      logApiError('GET', '/api/sales', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      logApiRequest('DELETE', `/api/sales/${id}`);
      await axios.delete(`/api/sales/${id}`);
      logApiResponse('DELETE', `/api/sales/${id}`, 'Success');
    } catch (error) {
      logApiError('DELETE', `/api/sales/${id}`, error);
      throw error;
    }
  }

  async create(saleRequest: CreateSaleRequest): Promise<Sale> {
    try {
      logApiRequest('POST', '/api/sales', saleRequest);
      const res = await axios.post('/api/sales', saleRequest);
      logApiResponse('POST', '/api/sales', res.data);
      return res.data.data || res.data;
    } catch (error) {
      logApiError('POST', '/api/sales', error);
      throw error;
    }
  }

  async update(updateRequest: UpdateSaleRequest): Promise<Sale> {
    try {
      logApiRequest('PUT', `/api/sales/${updateRequest.id}`, updateRequest);
      const res = await axios.put(`/api/sales/${updateRequest.id}`, updateRequest);
      logApiResponse('PUT', `/api/sales/${updateRequest.id}`, res.data);
      return res.data.data || res.data;
    } catch (error) {
      logApiError('PUT', `/api/sales/${updateRequest.id}`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<Sale> {
    try {
      logApiRequest('GET', `/api/sales/${id}`);
      const res = await axios.get(`/api/sales/${id}`);
      logApiResponse('GET', `/api/sales/${id}`, res.data);
      return res.data.data;
    } catch (error) {
      logApiError('GET', `/api/sales/${id}`, error);
      throw error;
    }
  }
}