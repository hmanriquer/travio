import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useUser() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axios.get('/api/user');
      return data;
    },
  });
}
