import { apiClient } from "../Axios";

export const getJWT = (accessToken) => apiClient.get(`/auth/google/callback?access_token=${accessToken}`);
