import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) return null

        const res = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        return res.data

      } catch (error) {
        // 🔥 PENTING: JANGAN THROW
        return null
      }
    }
  })
}