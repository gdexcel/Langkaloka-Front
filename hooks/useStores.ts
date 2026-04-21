//langkaloka-v1\hooks\useStores.ts
//Fetch All Toko to Swiper homepage
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data } = await axios.get("/api/stores");
      return data;
    },
  });
};
