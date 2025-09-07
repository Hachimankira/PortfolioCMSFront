import apiClient from '../api-client';
import { Link, CreateLinkDto, UpdateLinkDto } from '../types/link.types';

export const linkService = {
  async getAll(): Promise<Link[]> {
    const response = await apiClient.get('/api/sociallinks');
    return response.data;
  },

  async getById(id: number): Promise<Link> {
    const response = await apiClient.get(`/api/sociallinks/${id}`);
    return response.data;
  },

  async create(data: CreateLinkDto): Promise<Link> {
    const response = await apiClient.post('/api/sociallinks', data);
    return response.data;
  },

  async update(id: number, data: UpdateLinkDto): Promise<Link> {
    const response = await apiClient.put(`/api/sociallinks/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/sociallinks/${id}`);
  }
};