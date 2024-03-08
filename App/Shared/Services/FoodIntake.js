import { apiClient } from "../Axios";

export const getFoodIntakes = (id, page, pageSize) => apiClient.get(`/food-intakes?filters[users_permissions_user][id][$eq]=${id}&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
export const postFoodIntakes = (data) => apiClient.post(`/food-intakes`, data);
export const deleteFoodIntakes = (id) => apiClient.delete(`/food-intakes/${id}`);