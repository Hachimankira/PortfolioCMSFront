import apiClient from '../api-client';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '../types/testimonial.types';

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const response = await apiClient.get('/api/testimonials');
    return response.data;
  },

  async getById(id: number): Promise<Testimonial> {
    const response = await apiClient.get(`/api/testimonials/${id}`);
    return response.data;
  },

  async create(data: CreateTestimonialDto): Promise<Testimonial> {
    const response = await apiClient.post('/api/testimonials', data);
    return response.data;
  },

  async update(id: number, data: UpdateTestimonialDto): Promise<Testimonial> {
    const response = await apiClient.put(`/api/testimonials/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/testimonials/${id}`);
  }
};