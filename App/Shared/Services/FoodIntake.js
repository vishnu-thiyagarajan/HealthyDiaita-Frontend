import { apiClient } from "../Axios";

export const getFoodIntakes = (email, page, pageSize) => apiClient.get(`/food-intakes?filters[email][$eq]=${email}&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
export const getAllFoodIntakes = () => apiClient.get(`/food-intakes`);