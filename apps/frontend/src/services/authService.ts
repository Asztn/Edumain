import api from './api';
import { User } from '@/types'; // Adjust path

interface AuthResponse {
  accessToken: string;
  user: User; // Assuming backend returns user details on login/register
}

export const registerUser = async (userData: any) => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};
