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
      localStorage.setItem("userId", data.user.id)

      // reload supaya header update
      window.location.reload()
    },

    onError: (error) => {
      console.error("Login failed:", error)
    },
  })
}