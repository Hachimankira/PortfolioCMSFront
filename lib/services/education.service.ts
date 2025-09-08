import apiClient from "../api-client";
import { CreateEducationDto, Education, UpdateEducationDto } from "../types/education.types";

export const EducationService = {
    async  getAll(): Promise<Education[]> {
        const response = await apiClient.get('/api/education');
        return response.data;
    },
    async getById(id: number): Promise<Education> {
        const response = await apiClient.get(`/api/education/${id}`);
        return response.data;
    },
    async create(data: CreateEducationDto): Promise<Education> {
        const response = await apiClient.post('/api/education', data);
        return response.data;
    },
    async update(id: number, data: UpdateEducationDto): Promise<Education> {
        const response = await apiClient.put(`/api/education/${id}`, data);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/education/${id}`);
    }
};