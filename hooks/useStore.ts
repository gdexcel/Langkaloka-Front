import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useStore = (id: string) => {

  return useQuery({
    queryKey: ["store", id],

    queryFn: async () => {
      const { data } = await axios.get(`/api/stores/${id}`)
      return data
    },

    enabled: !!id
  })

}