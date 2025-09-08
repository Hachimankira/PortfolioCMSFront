import apiClient from '../api-client';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types/project.types';

export const projectService = {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get('/api/project');
    return response.data;
  },

  async getById(id: number): Promise<Project> {
    const response = await apiClient.get(`/api/project/${id}`);
    return response.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post('/api/project', data);
    return response.data;
  },

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.put(`/api/project/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/project/${id}`);
  }
};