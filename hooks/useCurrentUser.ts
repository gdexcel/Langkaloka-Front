import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useCurrentUser = () => {

  return useQuery({
    queryKey: ["currentUser"],

    queryFn: async () => {

      const token = localStorage.getItem("token")

      if (!token) return null

      const { data } = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return data
    },
  })
}