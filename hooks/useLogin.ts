//langkaloka-v1\hooks\useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
}

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void; // ← tambah ini
}) => {
  const queryClient = useQueryClient();

  const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await axios.post("/api/auth/login", payload);
    return data;
  };

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onSuccess?.();
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Login gagal";
      toast.error(message);
      onError?.(); // ← tambah ini
    },
  });
};
