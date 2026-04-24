import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    storeId: string | null;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRegister = (options?: any) => {
  const registerUser = async (
    payload: RegisterPayload,
  ): Promise<RegisterResponse> => {
    const { data } = await axios.post("/api/auth/register", payload);
    return data;
  };

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      console.error("Register failed:", err);
      options?.onError?.(err); // ← tambah ini
    },
  });
};
