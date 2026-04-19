import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],

    queryFn: async () => {
      const token = localStorage.getItem('token');


      const { data } = await axios.get('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
  });
};
