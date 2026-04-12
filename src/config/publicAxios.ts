import axios from 'axios';

export const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  headers: { 'Content-Type': 'application/json' },
});
