import { apiClient } from "../Axios";

export const getMe = () => apiClient.get(`users/me?populate=role`);
export const getClientUsers = (start, limit) => apiClient.get(`/users?filters[role][name][$eq]=Client&filters[blocked][$eq]=false&sort[0]=createdAt:desc&start=${start}&limit=${limit}`);
export const getClientUsersCount = (roleid) => apiClient.get(`/users/count?blocked=false&role=${roleid}`);
export const getRoles = () => apiClient.get('/users-permissions/roles');
export const searchClientUser = (term) => apiClient.get(`/users?filters[role][name][$eq]=Client&filters[blocked][$eq]=false&filters[username][$contains]=${term}`)