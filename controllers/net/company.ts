import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { COMPANIES_URL } from '../apiURLs';
import * as gState from '../data/states';
import * as gType from '../data/types';
import { useDebounce } from '../debounce';

export const useGetCompanies = () => {
  // use debounced value so that everytime the user types won't fire fetching
  const search_word = useDebounce(useAtomValue(gState.searchInput), 300);

  return useQuery({
    queryKey: ['company', search_word] as const,
    queryFn: getCompanies,
    enabled: !!search_word,
    staleTime: Infinity,
    placeholderData: [],
  });
};

const getCompanies = async ({ queryKey }: QueryFunctionContext<readonly ['company', string]>) => {
  const [_key, search_word] = queryKey;

  const url = `${COMPANIES_URL}/${encodeURIComponent(search_word)}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status === 404) {
    return [];
  }

  if (res.status >= 400) {
    const err: gType.MyError = await res.json();
    throw Error(err.message);
  }

  const data: gType.CompanyRaw[] = await res.json();

  const result: gType.Company[] = data.map((d) => {
    const name = d.ticker ?? '';
    const fullName = d.title ?? '';
    const codePrice = d.ticker ?? '';
    const codeReport = d.cik_str ?? '';
    const mkt = 'US Market';
    return { name, fullName, codePrice, codeReport, mkt };
  });

  return result;
};
