// Payload for Sign Up
export type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

// Payload for Sign In (GET params)
export type SigninParams = {
  email: string;
  password: string;
};

// Generic API response with just status and message
export type ApiResponse = {
  status: number;
  message: string;
};

// Successful Sign In response data
export type SigninSuccessData = {
  id: number;
  fname: string;
  lname: string;
  email: string;
  timemodified: string; // ISO datetime string
};

export type SigninResponse = ApiResponse & {
  data?: SigninSuccessData;
};

// To Do Task item type
export type TodoItem = {
  item_id: number;
  item_name: string;
  item_description: string;
  status: "active" | "inactive";
  user_id: number;
  timemodified: string; // ISO datetime string
};

// Response for Get To Do Task
export type GetTodoResponse = ApiResponse & {
  data: Record<string, TodoItem>; // keys are "0", "1", etc.
  count: string; // number as string
};

// Payload for Adding a To Do Task
export type AddTodoPayload = {
  item_name: string;
  item_description: string;
  user_id: number;
};

// Response for Adding a To Do Task
export type AddTodoResponse = ApiResponse & {
  data?: TodoItem;
  message: string;
};

// Payload for Updating a To Do Task
export type UpdateTodoPayload = {
  item_id: number;
  item_name: string;
  item_description: string;
};

// Payload for Changing To Do Task Status
export type UpdateTodoStatusPayload = {
  item_id: number;
  status: "active" | "inactive";
};

// Payload for Deleting a To Do Task (sent as query param)
export type DeleteTodoParams = {
  item_id: number;
};
