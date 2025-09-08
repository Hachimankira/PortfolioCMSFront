import apiClient from "../api-client";
import { Profile, UpdateProfileDto } from "../types/profile.types";

export const profileService ={
    async getProfile(): Promise<Profile> {
        const response = await apiClient.get('/api/profile');
        return response.data;
    },

    async updateProfile(data: UpdateProfileDto): Promise<Profile> {
        const response = await apiClient.put('/api/profile', data);
        return response.data;
    }
}