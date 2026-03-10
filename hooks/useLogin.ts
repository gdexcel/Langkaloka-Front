import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    phone: string
    storeId: string | null
  }
}

export const useLogin = () => {
  const loginUser = async (
    payload: LoginPayload,
  ): Promise<LoginResponse> => {
    const { data } = await axios.post("/api/auth/login", payload)
    return data
  }

  return useMutation({
    mutationFn: loginUser,

  onSuccess: (data) => {
      localStorage.setItem("token", data.token)

      // reload supaya header update
      window.location.reload()
    },

    onError: (error) => {
      console.error("Login failed:", error)
    },
  })
}