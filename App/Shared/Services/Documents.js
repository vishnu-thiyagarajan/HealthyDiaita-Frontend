import { apiClient } from "../Axios";

export const getDocuments = (id, page, pageSize) => apiClient.get(`/documents?filters[user][id][$eq]=${id}&populate=*&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
export const postDocuments = (data) => apiClient.post(`/documents`, data);
export const uploadDocuments = (data) => apiClient.post(`/upload`, data,  {
    headers: {
    'Content-Type': 'multipart/form-data',
    }
});
export const deleteFile = (id) => apiClient.delete(`/upload/files/${id}`);
export const deleteDocuments = (id) => apiClient.delete(`/documents/${id}`);