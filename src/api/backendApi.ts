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
// Remove axios import and instance
const BASE_URL = "https://todo-list.dcism.org/";

// Auth API
export const authApi = {
  signUp: async (payload: SignupPayload): Promise<ApiResponse> => {
    const response = await fetch(`${BASE_URL}signup_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  signIn: async (params: SigninParams): Promise<SigninResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(
      `${BASE_URL}signin_action.php?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },
};

// Todo API
export const todoApi = {
  getItems: async (
    status: "active" | "inactive",
    user_id: number
  ): Promise<GetTodoResponse> => {
    const queryString = new URLSearchParams({
      status,
      user_id: user_id.toString(),
    }).toString();
    const response = await fetch(
      `${BASE_URL}getItems_action.php?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },

  addItem: async (payload: AddTodoPayload): Promise<AddTodoResponse> => {
    const response = await fetch(`${BASE_URL}addItem_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  updateItem: async (payload: UpdateTodoPayload): Promise<ApiResponse> => {
    const response = await fetch(`${BASE_URL}editItem_action.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  updateStatus: async (
    payload: UpdateTodoStatusPayload
  ): Promise<ApiResponse> => {
    const response = await fetch(`${BASE_URL}statusItem_action.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  deleteItem: async (item_id: number): Promise<ApiResponse> => {
    const response = await fetch(
      `${BASE_URL}deleteItem_action.php?item_id=${item_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },
};
