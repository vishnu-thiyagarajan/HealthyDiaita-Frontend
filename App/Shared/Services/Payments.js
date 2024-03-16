import axios from 'axios';
import { Buffer } from 'buffer';
import { apiClient } from "../Axios";

export const getPayments = (id, page, pageSize) => apiClient.get(`/payments?filters[user][id][$eq]=${id}&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
export const postPayments = (data) => apiClient.post(`/payments`, data);
export const makeOrder = (data) => {
    const token = Buffer.from(`${process.env.EXPO_PUBLIC_RP_USER_NAME}:${process.env.EXPO_PUBLIC_RP_PASSWORD}`, 'utf8').toString('base64');
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Basic ${token}`
        }
    };
    return axios.post(process.env.EXPO_PUBLIC_RP_ORDER_URL, data, config)
}