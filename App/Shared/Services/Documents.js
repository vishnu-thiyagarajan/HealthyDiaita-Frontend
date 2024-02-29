import { apiClient } from "../Axios";

export const getDocuments = (email, page, pageSize) => apiClient.get(`/documents?filters[email][$eq]=${email}&populate=*&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
export const postDocuments = (data) => apiClient.post(`/documents`, data);
export const uploadDocuments = (data) => apiClient.post(`/upload`, data,  {
    headers: {
    'Content-Type': 'multipart/form-data',
    }
    });
export const deleteDocuments = (id) => apiClient.delete(`/documents/${id}`);