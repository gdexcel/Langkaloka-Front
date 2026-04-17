//langkaloka-v1\hooks\useProduct.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],

    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    },

    enabled: !!id,
  });
};
