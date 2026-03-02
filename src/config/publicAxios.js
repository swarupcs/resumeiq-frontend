import axios from 'axios';

// ✅ No credentials — for public endpoints
export const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});



