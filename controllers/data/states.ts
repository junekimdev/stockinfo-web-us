import { atom } from 'jotai';
import { atomFamily, atomWithReset } from 'jotai/utils';
import {
  TypeAdx,
  TypeAtrp,
  TypeChaikin,
  TypeCompanyTab,
  TypeIDPriceMA,
  TypeMacd,
  TypeMacdV,
  TypeMovingAvg,
  TypeParabolicSAR,
  TypePrice,
  TypePriceBollingerBands,
  TypePricePercentChange,
  TypePriceRequest,
  TypeRsi,
  TypeStochastic,
} from './types';

export const stateErrorCode = atom(500);
export const StateTabsInitiated = atom(false);

export const StatePricePercentChange = atomFamily(
  (_req: TypePriceRequest) => atom<TypePricePercentChange[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const StatePriceHeikinAshi = atomFamily(
  (_req: TypePriceRequest) => atom<TypePrice[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const StatePriceHeikinAshiSmoothed = atomFamily(
  (_req: TypePriceRequest) => atom<TypePrice[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const StatePriceSAR = atomFamily(
  (_req: TypePriceRequest) => atom<TypeParabolicSAR[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const StatePriceBollingerBands = atomFamily(
  (_req: TypePriceRequest) => atom<TypePriceBollingerBands[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const StateAdx = atomFamily(
  (_req: TypePriceRequest) => atom<TypeAdx[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const StateRsi = atomFamily(
  (_req: TypePriceRequest) => atom<TypeRsi[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const StateMacd = atomFamily(
  (_req: TypePriceRequest) => atom<TypeMacd[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const StateMacdV = atomFamily(
  (_req: TypePriceRequest) => atom<TypeMacdV[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const StateAtrp = atomFamily(
  (_req: TypePriceRequest) => atom<TypeAtrp[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const StateChaikin = atomFamily(
  (_req: TypePriceRequest) => atom<TypeChaikin[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);
export const StateStochastic = atomFamily(
  (_req: TypePriceRequest) => atom<TypeStochastic[]>([]),
  (a, b) => a.code === b.code && a.type === b.type,
);

export const StatePriceMA = atomFamily(
  (_req: TypeIDPriceMA) => atom<TypeMovingAvg[]>([]),
  (a, b) =>
    a.code === b.code && a.type === b.type && a.method === b.method && a.period === b.period,
);

export const StateSearchInput = atomWithReset('');

export const StateCompanyTabs = atomWithReset<TypeCompanyTab[]>([]);

export const StateCurrentTab = atomWithReset<TypeCompanyTab>({
  uuid: '',
  company: { cik: '', code: '', name: '' },
  mainType: 'daily',
});

export const StateRecentSearchTabs = atomWithReset<TypeCompanyTab[]>([]);

export const StateDetailsOpened = atom(false);
