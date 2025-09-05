import apiClient from '@/lib/api-client';
import { Certificate, CreateCertificateDto, UpdateCertificateDto } from '../types/certificate.types';

export const certificateService = {
  async getAll(): Promise<Certificate[]> {
    const response = await apiClient.get('/api/certification');
    return response.data;
  },

  async getById(id: string): Promise<Certificate> {
    const response = await apiClient.get(`/api/certification/${id}`);
    return response.data;
  },

  async create(data: CreateCertificateDto): Promise<Certificate> {
    const response = await apiClient.post('/api/certification', data);
    return response.data;
  },

  async update(id: string, data: UpdateCertificateDto): Promise<Certificate> {
    const response = await apiClient.put(`/api/certification/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/certification/${id}`);
  },
};