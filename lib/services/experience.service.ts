import apiClient from "../api-client";
import { CreateExperienceDto, Experience, UpdateExperienceDto } from "../types/experience.types";

export const ExperienceService = {
    async getAll():Promise<Experience[]> {
        const response = await apiClient.get('/api/experience');
        return response.data;
    },
    async getById(id: number): Promise<Experience> {
        const response = await apiClient.get(`/api/experience/${id}`);
        return response.data;
    },
    async create(data: CreateExperienceDto): Promise<Experience> {
        const response = await apiClient.post('/api/experience', data);
        return response.data;
    },
    async update(id: number, data: UpdateExperienceDto): Promise<Experience> {
        const response = await apiClient.put(`/api/experience/${id}`, data);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/experience/${id}`);
    }
};