import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import {
  TypeEdgarStatementItem,
  TypeEdgarStatementItemRaw,
  TypeEdgarStatementRes,
  TypeEdgarStatementResRaw,
} from '../../controllers/data/types';
import { EDGAR_URL } from '../apiURLs';

export const useGetEdgarStatement = (cik: string) => {
  return useQuery({
    queryKey: ['edgar', cik],
    queryFn: getEdgarStatement,
    enabled: !!cik,
    staleTime: Infinity,
    placeholderData: {
      cik: '',
      outstandingStock: [],
      assets: [],
      equity: [],
      liabilities: [],
      revenue: [],
      operatingIncome: [],
      netIncome: [],
      comprehensiveIncome: [],
      operatingCashFlow: [],
      investingCashFlow: [],
      financingCashFlow: [],
    } as TypeEdgarStatementRes,
  });
};

const getEdgarStatement = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, cik] = queryKey;

  const url = `${EDGAR_URL}/${cik}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const data: TypeEdgarStatementResRaw = await res.json();

  const outstandingStock = parseItemArray(data.outstandingStock);
  const assets = parseItemArray(data.assets);
  const equity = parseItemArray(data.equity);
  const liabilities = parseItemArray(data.liabilities);
  const revenue = parseItemArray(data.revenue);
  const operatingIncome = parseItemArray(data.operatingIncome);
  const netIncome = parseItemArray(data.netIncome);
  const comprehensiveIncome = parseItemArray(data.comprehensiveIncome);
  const operatingCashFlow = parseItemArray(data.operatingCashFlow);
  const investingCashFlow = parseItemArray(data.investingCashFlow);
  const financingCashFlow = parseItemArray(data.financingCashFlow);
  const r: TypeEdgarStatementRes = {
    cik,
    outstandingStock,
    assets,
    equity,
    liabilities,
    revenue,
    operatingIncome,
    netIncome,
    comprehensiveIncome,
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
  };

  return r;
};

const parseItemArray = (data: TypeEdgarStatementItemRaw[]) => {
  const r: TypeEdgarStatementItem[] = [];
  for (const item of data) {
    const dateStr = item.date ? item.date : item.end_date;
    const date = dateStr ? new Date(dateStr) : new Date();
    const value = parseFloat(item.value);
    r.push({ date, value });
  }
  r.sort((a, b) => b.date.valueOf() - a.date.valueOf()); // order by date: latest comes first
  return r;
};
