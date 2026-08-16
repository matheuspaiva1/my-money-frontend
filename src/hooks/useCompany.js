import { useQuery } from '@tanstack/react-query';
import { getCompany } from '../services/companyService';

export function useCompany() {
  return useQuery({
    queryKey: ['company'],
    queryFn: getCompany,
    retry: false,
  });
}
