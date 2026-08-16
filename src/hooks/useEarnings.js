import { useQuery } from '@tanstack/react-query';
import { getEarnings } from '../services/earningsService';

export function useEarnings() {
  return useQuery({
    queryKey: ['earnings'],
    queryFn: getEarnings,
  });
}
