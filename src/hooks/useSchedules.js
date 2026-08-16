import { useQuery } from '@tanstack/react-query';
import { listSchedules } from '../services/scheduleService';

export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: listSchedules,
  });
}
