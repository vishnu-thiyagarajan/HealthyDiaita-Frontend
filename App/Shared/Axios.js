import { API_KEY, BACKEND_URL } from '@env';
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "X-API-KEY": API_KEY,
  }
});
