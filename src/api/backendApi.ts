// src/api/apiClient.ts
import axios from "axios";
import {
  SignupPayload,
  SigninParams,
  ApiResponse,
  SigninResponse,
  GetTodoResponse,
  AddTodoPayload,
  AddTodoResponse,
  UpdateTodoPayload,
  UpdateTodoStatusPayload,
} from "../types";

// Axios instance with default headers
export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const authApi = {
  signUp: async (payload: SignupPayload): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(
      import.meta.env.VITE_API_SIGN_UP,
      payload
    );
    return response.data;
  },

  signIn: async (params: SigninParams): Promise<SigninResponse> => {
    const response = await axiosInstance.get<SigninResponse>(
      import.meta.env.VITE_API_SIGN_IN,
      { params }
    );
    return response.data;
  },
};

// Todo API
export const todoApi = {
  getItems: async (
    status: "active" | "inactive",
    user_id: number
  ): Promise<GetTodoResponse> => {
    const response = await axiosInstance.get<GetTodoResponse>(
      import.meta.env.VITE_API_GET_TODO,
      { params: { status, user_id } }
    );
    return response.data;
  },

  addItem: async (payload: AddTodoPayload): Promise<AddTodoResponse> => {
    const response = await axiosInstance.post<AddTodoResponse>(
      import.meta.env.VITE_API_ADD_TODO,
      payload
    );
    return response.data;
  },

  updateItem: async (payload: UpdateTodoPayload): Promise<ApiResponse> => {
    const response = await axiosInstance.put<ApiResponse>(
      import.meta.env.VITE_API_UPDATE_TODO,
      payload
    );
    return response.data;
  },

  updateStatus: async (
    payload: UpdateTodoStatusPayload
  ): Promise<ApiResponse> => {
    const response = await axiosInstance.put<ApiResponse>(
      import.meta.env.VITE_API_UPDATE_STATUS,
      payload
    );
    return response.data;
  },

  deleteItem: async (item_id: number): Promise<ApiResponse> => {
    const response = await axiosInstance.delete<ApiResponse>(
      import.meta.env.VITE_API_DELETE_TODO,
      { params: { item_id } }
    );
    return response.data;
  },
};
