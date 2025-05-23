import api from './api';
import { Resource } from '@/types'; // Adjust path

export const getResources = async (): Promise<Resource[]> => {
  const response = await api.get<Resource[]>('/resources');
  return response.data;
};

export const getResourceById = async (id: string): Promise<Resource> => {
  const response = await api.get<Resource>(`/resources/${id}`);
  return response.data;
};

export const createResource = async (resourceData: FormData): Promise<Resource> => {
  // Assuming backend handles FormData for file uploads if necessary for coverImage etc.
  // Adjust content type if not using FormData e.g. application/json
  const response = await api.post<Resource>('/resources', resourceData, {
      headers: {
          // 'Content-Type': 'multipart/form-data', // if using FormData
      }
  });
  return response.data;
};
