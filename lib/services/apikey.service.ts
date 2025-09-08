import apiClient from "../api-client";

const apiKeyService = {
    async getCurrentKey() {
        const response = await apiClient.get('/api/apikey');
        return response.data;
    },

    async regenerateKey() {
        const response = await apiClient.post('/api/apikey/regenerate');
        return response.data;
    }
}

export default apiKeyService;