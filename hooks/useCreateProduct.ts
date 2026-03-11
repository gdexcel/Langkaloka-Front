import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export const useCreateProduct = () => {

  return useMutation({

    mutationFn: async (payload: {
      name: string
      description?: string
      price: number
      condition?: string
      storeId: string
      categoryId?: string
    }) => {

      const token = localStorage.getItem("token")

      const { data } = await axios.post(
        "/api/products/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return data
    },

  })
}