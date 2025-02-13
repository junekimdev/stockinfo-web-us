import { atom } from 'jotai';
import { atomFamily, atomWithReset } from 'jotai/utils';
import * as gType from './types';

export const errorCode = atom(500);
export const tabsInitiated = atom(false);

export const pricePercentChange = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.PricePercentChange[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const priceHeikinAshi = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Price[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const priceHeikinAshiSmoothed = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Price[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const priceSAR = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.ParabolicSAR[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const priceBollingerBands = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.PriceBollingerBands[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const adx = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Adx[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const rsi = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Rsi[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const macd = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Macd[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const macdV = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.MacdV[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const atrp = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Atrp[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const chaikin = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Chaikin[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const stochastic = atomFamily(
  (_req: gType.PriceRequest) => atom<gType.Stochastic[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const priceMA = atomFamily(
  (_req: gType.IDPriceMA) => atom<gType.MovingAvg[]>([]),
  (a, b) =>
    a.code === b.code && a.type === b.type && a.method === b.method && a.period === b.period,
);

export const searchInput = atomWithReset('');

export const companyTabs = atomWithReset<gType.CompanyTab[]>([]);

export const currentTab = atomWithReset<gType.CompanyTab>({
  uuid: '',
  company: { cik: '', code: '', name: '' },
  mainType: 'daily',
});

export const recentSearchTabs = atomWithReset<gType.CompanyTab[]>([]);

export const detailsOpened = atom(false);
