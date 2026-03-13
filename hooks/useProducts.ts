import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useProducts = () => {

  return useQuery({
    queryKey: ["products"],

    queryFn: async () => {
      const { data } = await axios.get("/api/products")
      return data
    }

  })

}