import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { PRICES_URL } from '../apiURLs';
import {
  TypeError,
  TypeIDWeek,
  TypePrice,
  TypePriceRequest,
  TypePriceRequestType,
  TypePriceVolume,
} from '../data/types';

export const useGetPrices = (req: TypePriceRequest) => {
  const { code, type } = req;
  return useQuery({
    queryKey: ['prices', code, type],
    queryFn: getPrices,
    enabled: !!code && !!type,
    staleTime: Infinity,
    placeholderData: [],
  });
};

export const useGetPricesLatest = (req: TypePriceRequest) => {
  const { code, type } = req;
  return useQuery({
    queryKey: ['prices', code, type],
    queryFn: getPricesLatest,
    enabled: !!code && !!type,
    staleTime: 60000, // 1 minute
    placeholderData: [],
  });
};

const getPrices = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, code, _t] = queryKey;
  const t = _t as TypePriceRequestType;

  const url = `${PRICES_URL}/${code}/${t}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const prices: any[] | undefined = (await res.json())?.prices;
  if (typeof prices === 'undefined') throw Error(`failed to GET ${url}`);
  if (!prices.length) throw Error(`received an empty response for GET ${url}`);

  // parse numeric string to number
  const data: TypePriceVolume[] = prices.reverse().map((v) => {
    const date = t === 'daily' ? new Date(v.date) : ({ year: v.year, week: v.week } as TypeIDWeek);
    const open = parseFloat(v.open);
    const close = parseFloat(v.close);
    const high = parseFloat(v.high);
    const low = parseFloat(v.low);
    const volume = parseInt(v.volume);
    const adj_close = t === 'daily' ? parseFloat(v.adj_close) : NaN;
    const scaler = adj_close / close;
    return t === 'daily'
      ? {
          date,
          open: open * scaler,
          close: adj_close,
          high: high * scaler,
          low: low * scaler,
          volume,
        }
      : { date, open, close, high, low, volume };
  });

  return data;
};

const getPricesLatest = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, code, _t] = queryKey;
  const t = _t as TypePriceRequestType;

  const url = `${PRICES_URL}/${code}/${t}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const pricesRaw: any[] = (await res.json())?.prices;
  if (typeof pricesRaw !== 'object' || pricesRaw.length === 0)
    throw Error(`failed to parce data from ${url}`);

  const prices: TypePrice[] = [];
  for (let i = 0; i < pricesRaw.length; i++) {
    const date = new Date();
    const open = parseFloat(pricesRaw[i].open);
    const close = parseFloat(pricesRaw[i].close);
    const high = parseFloat(pricesRaw[i].high);
    const low = parseFloat(pricesRaw[i].low);
    const p: TypePrice = { date, open, high, low, close };
    prices.push(p);
  }

  return prices.reverse(); // reverse() places the latest price at index 0
};
