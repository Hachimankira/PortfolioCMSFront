import apiClient from "../api-client";
import { CreateSkillDto, Skill, UpdateSkillDto } from "../types/skills.types";

export const skillsService = {
    async getAll(): Promise<Skill[]> {
        const response = await apiClient.get('/api/skill');
        return response.data;
    },

    async getById(id: number): Promise<Skill> {
        const response = await apiClient.get(`/api/skill/${id}`);
        return response.data;
    },

    async create(data: CreateSkillDto): Promise<Skill> {
        const response = await apiClient.post('/api/skill', data);
        return response.data;
    },

    async update(id: number, data: UpdateSkillDto): Promise<Skill> {
        const response = await apiClient.put(`/api/skill/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/skill/${id}`);
    }
};