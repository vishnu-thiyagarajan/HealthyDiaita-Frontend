import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`,
  headers: {
    "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY,
  }
});
