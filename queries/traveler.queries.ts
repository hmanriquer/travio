import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { Traveler } from '@/schemas/traveler.schema';

export function useTravelers() {
  return useQuery({
    queryKey: ['travelers'],
    queryFn: async () => {
      const { data } = await axios.get('/api/travelers');
      return data as Traveler[];
    },
  });
}

export function useMutateTraveler() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (traveler: Traveler) => {
      const { data } = await axios.post('/api/travelers', traveler);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelers'] });
    },
  });
}
