import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { NewTravel, Travel } from '@/schemas/travel.schema';
import { useTravelStore } from '@/store/travel.store';

export function useTravels() {
  const { setTravels } = useTravelStore();

  return useQuery({
    queryKey: ['travels'],
    queryFn: async () => {
      const { data } = await axios.get('/api/travels');
      setTravels(data);
      return data;
    },
  });
}

export function useMutateTravel() {
  const queryClient = useQueryClient();
  const { setTravels } = useTravelStore();

  return useMutation({
    mutationFn: async (travel: NewTravel | Travel) => {
      const { data } = await axios.post('/api/travels', travel);
      setTravels(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travels'] });
    },
  });
}
