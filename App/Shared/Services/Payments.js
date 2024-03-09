import { apiClient } from "../Axios";
import axios from 'axios';
import { Buffer } from 'buffer';
import {RP_USER_NAME, RP_PASSWORD, RP_ORDER_URL} from '@env';

export const getPayments = (id, page, pageSize) => apiClient.get(`/payments?filters[user][id][$eq]=${id}&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
export const postPayments = (data) => apiClient.post(`/payments`, data);
export const makeOrder = (data) => {
    const token = Buffer.from(`${RP_USER_NAME}:${RP_PASSWORD}`, 'utf8').toString('base64');
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Basic ${token}`
        }
    };
    return axios.post(RP_ORDER_URL, data, config)
}