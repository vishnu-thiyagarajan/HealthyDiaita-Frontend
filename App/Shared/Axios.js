import axios from "axios";
import {BACKEND_URL, API_KEY} from '@env';

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "X-API-KEY": API_KEY,
  }
});
