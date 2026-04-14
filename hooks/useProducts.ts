import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useProducts = (query: string = "") => {

  return useQuery({
    queryKey: ["products", query],

    queryFn: async () => {
      const url = query ? `/api/products?q=${encodeURIComponent(query)}` : "/api/products"
      const { data } = await axios.get(url)
      return data
    }

  })

}