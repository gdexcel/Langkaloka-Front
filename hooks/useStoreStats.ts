//langkaloka-v1\hooks\useStoreStats.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useStoreStats() {
  return useQuery({
    queryKey: ["store-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/store-panel/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });
}
