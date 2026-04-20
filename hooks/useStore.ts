//langkaloka-v1\hooks\useStore.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      // 🔥 SAFE CHECK (biar ga error SSR)
      let token = null;

      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      const res = await axios.get(`/api/stores/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return res.data;
    },
    enabled: !!id,
  });
};
