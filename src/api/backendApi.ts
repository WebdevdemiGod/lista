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

// Base API URL
const BASE_URL = "https://todo-list.dcism.org/";

// Axios instance with default headers
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const authApi = {
  signUp: async (payload: SignupPayload): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(
      "signup_action.php",
      payload
    );
    return response.data;
  },

  signIn: async (params: SigninParams): Promise<SigninResponse> => {
    const response = await axiosInstance.get<SigninResponse>(
      "signin_action.php",
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
      "getItems_action.php",
      { params: { status, user_id } }
    );
    return response.data;
  },

  addItem: async (payload: AddTodoPayload): Promise<AddTodoResponse> => {
    const response = await axiosInstance.post<AddTodoResponse>(
      "addItem_action.php",
      payload
    );
    return response.data;
  },

  updateItem: async (payload: UpdateTodoPayload): Promise<ApiResponse> => {
    const response = await axiosInstance.put<ApiResponse>(
      "editItem_action.php",
      payload
    );
    return response.data;
  },

  updateStatus: async (
    payload: UpdateTodoStatusPayload
  ): Promise<ApiResponse> => {
    const response = await axiosInstance.put<ApiResponse>(
      "statusItem_action.php",
      payload
    );
    return response.data;
  },

  deleteItem: async (item_id: number): Promise<ApiResponse> => {
    const response = await axiosInstance.delete<ApiResponse>(
      "deleteItem_action.php",
      { params: { item_id } }
    );
    return response.data;
  },
};
