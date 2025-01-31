import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { COMPANIES_URL } from '../apiURLs';
import { StateSearchInput } from '../data/states';
import { TypeCompany, TypeError } from '../data/types';
import { useDebounce } from '../debounce';

export const useGetCompanies = () => {
  // use debounced value so that everytime the user types won't fire fetching
  const search_word = useDebounce(useAtomValue(StateSearchInput), 300);

  return useQuery({
    queryKey: ['company', search_word],
    queryFn: getCompanies,
    enabled: !!search_word,
    staleTime: Infinity,
    placeholderData: [],
  });
};

const getCompanies = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, search_word] = queryKey;

  const url = `${COMPANIES_URL}/${encodeURIComponent(search_word)}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status === 404) {
    return [];
  }

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const r: any[] = await res.json();

  const data = r.map((v) => {
    const cik: string = v?.cik_str ?? '';
    const code: string = v?.ticker ?? '';
    const name: string = v?.title ?? '';
    return { cik, code, name } as TypeCompany;
  });

  return data;
};
