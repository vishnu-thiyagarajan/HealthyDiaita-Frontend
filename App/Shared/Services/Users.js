import { apiClient } from "../Axios";

export const getMe = () => apiClient.get(`users/me?populate=role`);
export const getUsers = (id) => apiClient.get(`/users/${id}`);
export const postUsers = (data) => apiClient.post(`/users`, data);